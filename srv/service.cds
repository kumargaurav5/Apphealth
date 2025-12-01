using cf from '../db/schema';

@path: 'cf'
service CFService {
    entity GlobalAccount        as projection on cf.GlobalAccount;
    entity Subaccount           as projection on cf.Subaccount;
    entity Org                  as projection on cf.Org;
    entity Space                as projection on cf.Space;
    entity OrgSubaccountMapping as projection on cf.OrgSubaccountMapping;

    action SyncAllAccounts() returns {
        globalAccountsInserted : Integer;
        subaccountsInserted : Integer;
    };
}
