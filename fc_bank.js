function markStockMarketStateDirty() {
    Game.recalculateGains = 1;
    Game.upgradesToRebuild = 1;
}

function getCurrentBankOffice() {
    return B.offices[B.officeLevel];
}

function getBankOfficeUpgradeCost() {
    var currentOffice = getCurrentBankOffice();
    if (!currentOffice || !currentOffice.cost) {
        return null;
    }

    return {
        cursors: currentOffice.cost[0],
        cursorLevel: currentOffice.cost[1],
    };
}

function canAffordBankOfficeUpgrade(cost) {
    return Game.Objects["Cursor"].amount >= cost.cursors && Game.Objects["Cursor"].level >= cost.cursorLevel;
}

function canHireBroker(recommendation, delay) {
    return (
        recommendation.type === "building" &&
        B.brokers < B.getMaxBrokers() &&
        Game.cookies >= delay + B.getBrokerPrice()
    );
}

function shouldTakeAutoLoans() {
    return hasClickBuff() && !Game.hasBuff("Cursed finger") && cpsBonus() >= FrozenCookies.minLoanMult;
}

function takeAvailableLoans() {
    if (B.officeLevel >= 2) B.takeLoan(1);
    if (B.officeLevel >= 4) B.takeLoan(2);
    if (B.officeLevel >= 5 && FrozenCookies.autoLoan === 2) B.takeLoan(3);
}

function autoBankAction() {
    if (!B || hasClickBuff()) return;

    // Upgrade bank level.
    var upgradeCost = getBankOfficeUpgradeCost();
    if (upgradeCost && canAffordBankOfficeUpgrade(upgradeCost)) {
        l("bankOfficeUpgrade").click();
        safeBuy(Game.Objects["Cursor"], upgradeCost.cursors);
        FrozenCookies.autobuyCount += 1;
        logEvent("AutoBank", "Upgrade bank level for " + upgradeCost.cursors + " cursors");
        markStockMarketStateDirty();
    }
}

function autoBrokerAction() {
    if (!B) return; // Just leave if you don't have the stock market

    // Hire brokers.
    var delay = delayAmount(); //GC or harvest bank
    var recommendation = nextPurchase();
    if (canHireBroker(recommendation, delay)) {
        l("bankBrokersBuy").click();
        logEvent("AutoBroker", "Hired a broker for " + Beautify(B.getBrokerPrice()) + " cookies");
        markStockMarketStateDirty();
    }
}

function autoLoanBuy() {
    if (!B || B.officeLevel < 2) return;

    if (shouldTakeAutoLoans()) takeAvailableLoans();
}
