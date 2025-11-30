namespace cf;

entity GlobalAccount {
    key guid             : String(50);
        displayName      : String(255);
        createdDate      : Timestamp;
        modifiedDate     : Timestamp;
        subdomain        : String(255);
        commercialModel  : String(50);
        consumptionBased : Boolean;
        licenseType      : String(50);
}

entity Subaccount {
    key guid              : String(50);
        technicalName     : String(255);
        displayName       : String(255);
        globalAccount     : Association to GlobalAccount;
        parentGUID        : String(50);
        parentType        : String(50);
        region            : String(50);
        subdomain         : String(255);
        betaEnabled       : Boolean;
        usedForProduction : String(50);
        description       : String(255);
        stateMessage      : String(255);
        createdDate       : Timestamp;
        createdBy         : String(255);
        modifiedDate      : Timestamp;
}

entity OrgSubaccountMapping {
    key subaccount     : Association to Subaccount;
    key org            : String(50);
        orgApiEndpoint : String(255);
}

entity Org {
    key guid             : String(50);
        createdAt        : Timestamp;
        updatedAt        : Timestamp;
        name             : String(255);
        orgRegion        : String(50);
        orgApiEndpoint   : String(255);
        orgTokenEndpoint : String(255);
        tokenValidTill   : Timestamp;
        subaccount       : Association to Subaccount;
        spaces           : Composition of many Space
                               on spaces.org = $self;
}

entity Space {
    key guid      : String(50);
        name      : String(255);
        createdAt : Timestamp;
        updatedAt : Timestamp;
        org       : Association to Org;
}
