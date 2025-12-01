const cds = require('@sap/cds');
const { accGet } = require('./handlers/getaccounts');
const { toTs, toStrBool } = require('./handlers/helper');

module.exports = cds.service.impl(async (srv) => {
    if (srv.name !== 'CFService') return;

    const { GlobalAccount, Subaccount } = srv.entities;

    srv.on('SyncAllAccounts', async (req) => {
        try {
            console.log('🔄 Starting account sync...');

            // ---- 1) Fetch external data FIRST ----
            console.log('📥 Fetching Global Account...');
            const ga = await accGet('/accounts/v1/globalAccount');
            if (!ga?.guid) {
                throw new Error('Global Account response missing guid');
            }
            console.log(`✅ Found global account: ${ga.guid}`);

            console.log('📥 Fetching Subaccounts...');
            const saResp = await accGet(`/accounts/v1/subaccounts?globalAccountGUID=${ga.guid}`);
            const saList = Array.isArray(saResp?.value) ? saResp.value : [];
            console.log(`✅ Found ${saList.length} subaccounts`);

            // ---- 2) DB work in a transaction ----
            const tx = cds.transaction(req);
            let globalAccountsInserted = 0;
            let subaccountsInserted = 0;

            // Insert GA if missing
            const gaExists = await tx.run(
                SELECT.one.from(GlobalAccount).where({ guid: ga.guid })
            );

            if (!gaExists) {
                await tx.run(
                    INSERT.into(GlobalAccount).entries({
                        guid: ga.guid,
                        displayName: ga.displayName ?? ga.name ?? null,
                        createdDate: toTs(ga.createdDate),
                        modifiedDate: toTs(ga.modifiedDate),
                        subdomain: ga.subdomain ?? null,
                        commercialModel: ga.commercialModel ?? null,
                        consumptionBased: ga.consumptionBased ?? null,
                        licenseType: ga.licenseType ?? null
                    })
                );
                globalAccountsInserted = 1;
                console.log(`✅ Inserted global account: ${ga.guid}`);
            } else {
                console.log(`⏭️ Global account already exists: ${ga.guid}`);
            }

            // Speed-up: prefetch existing subaccount GUIDs
            const ids = saList.map(s => s && s.guid).filter(Boolean);
            const existing = ids.length ? await tx.run(
                SELECT.from(Subaccount).columns('guid').where({ guid: { in: ids } })
            ) : [];
            const existingSet = new Set(existing.map(r => r.guid));

            // Prepare rows to insert
            const toInsert = saList
                .filter(s => s?.guid && !existingSet.has(s.guid))
                .map(s => ({
                    guid: s.guid,
                    technicalName: s.technicalName ?? null,
                    displayName: s.displayName ?? s.name ?? null,
                    globalAccount_guid: ga.guid,
                    parentGUID: s.parentGUID ?? null,
                    parentType: s.parentType ?? null,
                    region: s.region ?? s.regionCode ?? null,
                    subdomain: s.subdomain ?? null,
                    betaEnabled: s.betaEnabled ?? null,
                    usedForProduction: toStrBool(s.usedForProduction),
                    description: s.description ?? null,
                    stateMessage: s.stateMessage ?? null,
                    createdDate: toTs(s.createdDate),
                    createdBy: s.createdBy ?? null,
                    modifiedDate: toTs(s.modifiedDate)
                }));

            if (toInsert.length) {
                await tx.run(INSERT.into(Subaccount).entries(toInsert));
                subaccountsInserted = toInsert.length;
                console.log(`✅ Inserted ${toInsert.length} subaccounts`);
            }

            await tx.commit();
            console.log('✨ Sync completed successfully');
            return { globalAccountsInserted, subaccountsInserted };

        } catch (err) {
            console.error('❌ Sync failed:', err.message);
            req.error(502, `Sync failed: ${err.message}`);
        }
    });
});
