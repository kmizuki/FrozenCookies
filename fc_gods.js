const PANTHEON_SLOT_DIAMOND = 0;
const PANTHEON_SLOT_RUBY = 1;
const PANTHEON_SLOT_JADE = 2;
const CYCLIUS_GOD_ID = 3;
const RIGIDEL_GOD_ID = 10;
const SCORN_GOD_ID = 11;
const DRAGON_AURA_DRAGONS_CURVE = 17;
const DRAGON_AURA_REALITY_BENDING = 18;

function swapIn(godId, targetSlot) {
    //mostly code copied from minigamePantheon.js, tweaked to avoid references to "dragging"
    if (!T.swaps) return;
    T.useSwap(1);
    T.lastSwapT = 0;
    var div = l("templeGod" + godId);
    var prev = T.slot[targetSlot]; //id of God currently in slot
    if (prev !== -1) {
        //when something's in there already
        prev = T.godsById[prev]; //prev becomes god object
        var prevDiv = l("templeGod" + prev.id);
        if (T.godsById[godId].slot !== -1) l("templeSlot" + T.godsById[godId].slot).appendChild(prevDiv);
        else {
            var other = l("templeGodPlaceholder" + prev.id);
            other.parentNode.insertBefore(prevDiv, other);
        }
    }
    l("templeSlot" + targetSlot).appendChild(l("templeGod" + godId));
    T.slotGod(T.godsById[godId], targetSlot);

    PlaySound("snd/tick.mp3");
    PlaySound("snd/spirit.mp3");

    var rect = l("templeGod" + godId).getBoundingClientRect();
    Game.SparkleAt((rect.left + rect.right) / 2, (rect.top + rect.bottom) / 2 - 24);
}

function canManagePantheon() {
    return T && T.swaps > 0;
}

function getAutoWorshipPreference(slot) {
    return FrozenCookies["autoWorship" + slot];
}

function disableAutoWorshipPreference(slot, message) {
    FrozenCookies["autoWorship" + slot] = 0;
    logEvent("autoWorship", message);
}

function autoWorshipAction(slot, conflicts) {
    var preferredGod = getAutoWorshipPreference(slot);
    if (
        !canManagePantheon() ||
        !FrozenCookies.autoWorshipToggle ||
        !preferredGod ||
        FrozenCookies.autoCyclius ||
        T.slot[slot] === preferredGod
    ) {
        return;
    }

    conflicts.forEach(function (conflict) {
        if (T.slot[conflict.slot] === preferredGod) {
            disableAutoWorshipPreference(slot, conflict.message);
            preferredGod = 0;
        }
    });

    if (preferredGod) swapIn(preferredGod, slot);
}

function swapPantheonGodIfNeeded(godId, slot, label) {
    if (!canManagePantheon() || godId === SCORN_GOD_ID || godId === CYCLIUS_GOD_ID || T.slot[slot] === godId) {
        return;
    }

    swapIn(godId, slot);
    logEvent("autoCyclius", "Set desired god to " + label);
}

function removeCycliusIfPresent() {
    if (Game.hasGod("ages")) {
        Game.forceUnslotGod("ages");
        logEvent("autoCyclius", "Removing Cyclius");
    }
}

function setDragonAuraWithConfirmation(auraId, slot, options) {
    options = options || {};
    Game.specialTab = "dragon";
    Game.SetDragonAura(auraId, slot);
    Game.ConfirmPrompt();
    if (options.closeMenu) Game.ToggleSpecialMenu();
    if (options.logMessage) {
        logEvent(options.logCategory || "autoDragon", options.logMessage);
    }
}

function suspendAutoDragonToggle() {
    var shouldRestore = FrozenCookies.autoDragonToggle === 1;
    if (shouldRestore) FrozenCookies.autoDragonToggle = 0;
    return shouldRestore;
}

function restoreAutoDragonToggle(shouldRestore) {
    if (shouldRestore) FrozenCookies.autoDragonToggle = 1;
}

function autoWorship0Action() {
    autoWorshipAction(PANTHEON_SLOT_DIAMOND, []);
}

function autoWorship1Action() {
    autoWorshipAction(PANTHEON_SLOT_RUBY, [
        {
            slot: PANTHEON_SLOT_DIAMOND,
            message: "Can't worship the same god in Diamond and Ruby slots!",
        },
    ]);
}

function autoWorship2Action() {
    autoWorshipAction(PANTHEON_SLOT_JADE, [
        {
            slot: PANTHEON_SLOT_DIAMOND,
            message: "Can't worship the same god in Diamond and Jade slots!",
        },
        {
            slot: PANTHEON_SLOT_RUBY,
            message: "Can't worship the same god in Ruby and Jade slots!",
        },
    ]);
}

function autoCycliusAction() {
    if (!T || T.swaps < 1 || !FrozenCookies.autoCyclius) return;
    const hasSupremeIntellect = Game.hasAura("Supreme Intellect");

    // Disable auto-Pantheon if enabled
    if (FrozenCookies.autoWorshipToggle === 1) {
        FrozenCookies.autoWorshipToggle = 0;
        logEvent("autoCyclius", "Turning off Auto-Pantheon");
    }

    // Switch to special two-slots mode if Supreme Intellect is detected
    // Third slot is not used by Cyclius in this mode
    // autoCyclius == 1 is two-slots mode
    // autoCyclius == 2 is three-slots mode
    if (FrozenCookies.autoCyclius === 2 && hasSupremeIntellect) {
        FrozenCookies.autoCyclius = 1;
        logEvent("autoCyclius", "Supreme Intellect detected! Swapping Cyclius to two slot mode");
    }

    // Time constants (in minutes)
    // See https://cookieclicker.fandom.com/wiki/Pantheon#Cyclius,_Spirit_of_Ages
    // SI ignores Diamond slot since it doesn't matter
    const cycliusTimes = {
        Ruby1: 1 * 60 + 12, //1:12 UTC: Ruby
        Jade1: 4 * 60, // 4:00 UTC: Jade
        SIJade: 6 * 60, // 6:00 UTC: SI Ruby-as-Diamond
        SIRuby: 7 * 60 + 30, // 7:30 UTC: SI Jade-as-Ruby
        Diamond2: 9 * 60 + 19, // 9:19 UTC: Diamond
        Jade2: 10 * 60 + 20, // 10:20 UTC: Jade
        Diamond3: 12 * 60, // 12:00 UTC: Diamond
        Ruby2: 13 * 60 + 12, // 13:12 UTC: Ruby
        Diamond4: 18 * 60, // 18:00 UTC: Diamond
        CycNone1: 19 * 60 + 30, // 19:30 UTC: No Cyclius
        Diamond5: 21 * 60, // 21:00 UTC: Diamond
        CycNone2: 22 * 60 + 30, // 22:30 UTC: No Cyclius
    };

    // Get current UTC time in minutes
    const now = new Date();
    const currentTime = now.getUTCHours() * 60 + now.getUTCMinutes();

    // Helper to swap gods if needed
    function swapIfNeeded(godId, slot, label) {
        if (godId !== SCORN_GOD_ID && godId !== CYCLIUS_GOD_ID && T.slot[slot] !== godId && T.swaps > 0) {
            swapIn(godId, slot);
            logEvent("autoCyclius", `set desired god to ${label}`);
        }
    }

    // Helper to remove Cyclius if present
    function removeCyclius() {
        if (Game.hasGod("ages")) {
            Game.forceUnslotGod("ages");
            logEvent("autoCyclius", "Removing Cyclius");
        }
    }

    // Main logic for two slots mode - never uses Diamond slot
    if (FrozenCookies.autoCyclius === 1 && !hasSupremeIntellect) {
        if (T.slot[1] !== 3 && currentTime < cycliusTimes.Jade1) {
            // 1:12 UTC to 4:00 UTC, RUBY
            swapIn(3, 1);
            logEvent("autoCyclius", "Putting Cyclius in RUBY");
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
        } else if (T.slot[2] !== 3 && currentTime >= cycliusTimes.Jade1 && currentTime < cycliusTimes.Diamond3) {
            // 4:00 UTC to 12:00 UTC, JADE
            swapIn(3, 2);
            logEvent("autoCyclius", "Putting Cyclius in JADE");
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
        } else if (
            // 12:00 UTC to 19:30 UTC, RUBY
            T.slot[1] !== 3 &&
            currentTime >= cycliusTimes.Diamond3 &&
            currentTime < cycliusTimes.Diamond4
        ) {
            swapIn(3, 1);
            logEvent("autoCyclius", "Putting Cyclius in RUBY");
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
        } else if (currentTime >= cycliusTimes.Diamond4) {
            // 19:30 UTC to 1:12 UTC, no Cyclius
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
            swapIfNeeded(FrozenCookies.autoWorship2, 2, "JADE");
            removeCyclius();
        }
    }

    // Main logic for three slots mode)
    if (FrozenCookies.autoCyclius === 2 && !hasSupremeIntellect) {
        if (T.slot[0] !== 3 && currentTime < cycliusTimes.Ruby1) {
            // 1:12 UTC to 4:00 UTC, DIAMOND
            swapIn(3, 0);
            logEvent("autoCyclius", "Putting Cyclius in DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship0, 1, "RUBY");
            swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
        } else if (
            // 4:00 UTC to 9:19 UTC, RUBY
            T.slot[1] !== 3 &&
            currentTime >= cycliusTimes.Ruby1 &&
            currentTime < cycliusTimes.Jade1
        ) {
            swapIn(3, 1);
            logEvent("autoCyclius", "Putting Cyclius in RUBY");
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
        } else if (
            // 9:19 UTC to 10:20 UTC, JADE
            T.slot[2] !== 3 &&
            currentTime >= cycliusTimes.Jade1 &&
            currentTime < cycliusTimes.Diamond2
        ) {
            swapIn(3, 2);
            logEvent("autoCyclius", "Putting Cyclius in JADE");
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
        } else if (
            // 10:20 UTC to 12:00 UTC, DIAMOND
            T.slot[0] !== 3 &&
            currentTime >= cycliusTimes.Diamond2 &&
            currentTime < cycliusTimes.Jade2
        ) {
            swapIn(3, 0);
            logEvent("autoCyclius", "Putting Cyclius in DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship0, 1, "RUBY");
            swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
        } else if (
            // 12:00 UTC to 13:12 UTC, RUBY
            T.slot[2] !== 3 &&
            currentTime >= cycliusTimes.Jade2 &&
            currentTime < cycliusTimes.Diamond3
        ) {
            swapIn(3, 2);
            logEvent("autoCyclius", "Putting Cyclius in JADE");
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
        } else if (
            //  13:12 UTC to 18:00 UTC, DIAMOND
            T.slot[0] !== 3 &&
            currentTime >= cycliusTimes.Diamond3 &&
            currentTime < cycliusTimes.Ruby2
        ) {
            swapIn(3, 0);
            logEvent("autoCyclius", "Putting Cyclius in DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship0, 1, "RUBY");
            swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
        } else if (
            // 13:12 UTC to 18:00 UTC, RUBY
            T.slot[1] !== 3 &&
            currentTime >= cycliusTimes.Ruby2 &&
            currentTime < cycliusTimes.Diamond4
        ) {
            swapIn(3, 1);
            logEvent("autoCyclius", "Putting Cyclius in RUBY");
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
        } else if (
            // 18:00 UTC to 19:30 UTC, DIAMOND
            T.slot[0] !== 3 &&
            currentTime >= cycliusTimes.Diamond4 &&
            currentTime < cycliusTimes.CycNone1
        ) {
            swapIn(3, 0);
            logEvent("autoCyclius", "Putting Cyclius in DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship0, 1, "RUBY");
            swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
        } else if (
            // 19:30 UTC to 21:00 UTC, no Cyclius
            currentTime >= cycliusTimes.CycNone1 &&
            currentTime < cycliusTimes.Diamond5
        ) {
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
            swapIfNeeded(FrozenCookies.autoWorship2, 2, "JADE");
            removeCyclius();
        } else if (
            // 21:00 UTC to 22:30 UTC, DIAMOND
            T.slot[0] !== 3 &&
            currentTime >= cycliusTimes.Diamond5 &&
            currentTime < cycliusTimes.CycNone2
        ) {
            swapIn(3, 0);
            logEvent("autoCyclius", "Putting Cyclius in DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship0, 1, "RUBY");
            swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
        } else if (currentTime >= cycliusTimes.CycNone2) {
            // // 22:30 UTC to 1:12 UTC, no Cyclius
            swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
            swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
            swapIfNeeded(FrozenCookies.autoWorship2, 2, "JADE");
            removeCyclius();
        }
    }

    // Supreme Intellect: Ruby acts as Diamond, Jade as Ruby
    if (hasSupremeIntellect) {
        if (FrozenCookies.autoCyclius === 1) {
            if (T.slot[1] !== 3 && currentTime < cycliusTimes.Ruby1) {
                // 1:12 UTC to 4:00 UTC, RUBY
                swapIn(3, 1);
                logEvent("autoCyclius", "Putting Cyclius in RUBY (SI)");
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
            } else if (
                // 4:00 UTC to 6:00 UTC, JADE
                T.slot[2] !== 3 &&
                currentTime >= cycliusTimes.Ruby1 &&
                currentTime < cycliusTimes.SIJade
            ) {
                swapIn(3, 2);
                logEvent("autoCyclius", "Putting Cyclius in JADE (SI)");
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
            } else if (
                // 6:00 UTC to 7:30 UTC, RUBY
                T.slot[1] !== 3 &&
                currentTime >= cycliusTimes.SIJade &&
                currentTime < cycliusTimes.SIRuby
            ) {
                swapIn(3, 1);
                logEvent("autoCyclius", "Putting Cyclius in RUBY (SI)");
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
            } else if (
                // 7:30 UTC to 12:00 UTC, no Cyclius
                currentTime >= cycliusTimes.SIRuby &&
                currentTime < cycliusTimes.Diamond2
            ) {
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND (SI)");
                swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
                swapIfNeeded(FrozenCookies.autoWorship2, 2, "JADE");
                removeCyclius();
            } else if (
                // 12:00 UTC to 13:12 UTC, RUBY
                T.slot[1] !== 3 &&
                currentTime >= cycliusTimes.Diamond2 &&
                currentTime < cycliusTimes.Jade2
            ) {
                swapIn(3, 1);
                logEvent("autoCyclius", "Putting Cyclius in RUBY (SI)");
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
            } else if (
                // 13:12 UTC to 18:00 UTC, no Cyclius
                currentTime >= cycliusTimes.Jade2 &&
                currentTime < cycliusTimes.Diamond3
            ) {
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
                swapIfNeeded(FrozenCookies.autoWorship2, 2, "JADE");
                removeCyclius();
            } else if (
                // 18:00 UTC to 19:30 UTC, RUBY
                T.slot[1] !== 3 &&
                currentTime >= cycliusTimes.Diamond3 &&
                currentTime < cycliusTimes.Ruby2
            ) {
                swapIn(3, 1);
                logEvent("autoCyclius", "Putting Cyclius in RUBY (SI)");
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
            } else if (
                // 13:12 UTC to 18:00 UTC, JADE
                T.slot[2] !== 3 &&
                currentTime >= cycliusTimes.Ruby2 &&
                currentTime < cycliusTimes.Diamond4
            ) {
                swapIn(3, 2);
                logEvent("autoCyclius", "Putting Cyclius in JADE (SI)");
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
            } else if (
                // 18:00 UTC to 19:30 UTC, RUBY
                T.slot[1] !== 3 &&
                currentTime >= cycliusTimes.Diamond4 &&
                currentTime < cycliusTimes.CycNone1
            ) {
                swapIn(3, 1);
                logEvent("autoCyclius", "Putting Cyclius in RUBY (SI)");
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
            } else if (
                // 19:30 UTC to 21:00 UTC, no Cyclius
                currentTime >= cycliusTimes.CycNone1 &&
                currentTime < cycliusTimes.Diamond5
            ) {
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
                swapIfNeeded(FrozenCookies.autoWorship2, 2, "JADE");
                removeCyclius();
            } else if (
                // 21:00 UTC to 22:30 UTC, RUBY
                T.slot[1] !== 3 &&
                currentTime >= cycliusTimes.Diamond5 &&
                currentTime < cycliusTimes.CycNone2
            ) {
                swapIn(3, 1);
                logEvent("autoCyclius", "Putting Cyclius in RUBY (SI)");
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 2, "JADE");
            } else if (currentTime >= cycliusTimes.CycNone2) {
                // // 22:30 UTC to 1:12 UTC, no Cyclius
                swapIfNeeded(FrozenCookies.autoWorship0, 0, "DIAMOND");
                swapIfNeeded(FrozenCookies.autoWorship1, 1, "RUBY");
                swapIfNeeded(FrozenCookies.autoWorship2, 2, "JADE");
                removeCyclius();
            }
        }
    }
}

function lumpIn(mins) {
    //For debugging, set minutes until next lump is *ripe*
    Game.lumpT = Date.now() - Game.lumpRipeAge + 60000 * mins;
}

function rigiSell() {
    //Sell enough of the cheapest building to enable Rigidels effect
    if (Game.BuildingsOwned % 10) {
        var cheapest;
        Game.ObjectsById.forEach(function (b) {
            if (!cheapest || b.price < cheapest.price) {
                cheapest = b;
            }
        });
        cheapest.sell(Game.BuildingsOwned % 10);
    }
    return;
}

function autoRigidel() {
    if (!T) return; // Exit if Pantheon doesn't exist

    const started = Game.lumpT;
    const timeToRipe = (Math.ceil(Game.lumpRipeAge) - (Date.now() - started)) / 60000; // Minutes until sugar lump ripens
    const orderLvl = Game.hasGod("order") ? Game.hasGod("order") : 0;
    let prevGod = -1;
    let tryHarvest = false;

    // Only proceed if we have swaps available
    if (T.swaps < 1 && orderLvl === 0) return;

    // Determine if Rigidel is in a slot and act accordingly
    if (orderLvl === 0) {
        // Rigidel isn't in a slot
        if (T.swaps < (T.slot[PANTHEON_SLOT_DIAMOND] === -1 ? 1 : 2)) return; // Not enough swaps to proceed
        if (timeToRipe < 60) {
            prevGod = T.slot[PANTHEON_SLOT_DIAMOND]; // Cache current god in diamond slot
            swapIn(RIGIDEL_GOD_ID, PANTHEON_SLOT_DIAMOND); // Swap in Rigidel to diamond slot
            tryHarvest = true;
        }
    } else if (orderLvl === 1) {
        // Rigidel is in diamond slot
        if (timeToRipe < 55) tryHarvest = true;
    } else if (orderLvl === 2) {
        // Rigidel is in ruby slot
        if (timeToRipe < 35) tryHarvest = true;
    } else if (orderLvl === 3) {
        // Rigidel is in jade slot
        if (timeToRipe < 15) tryHarvest = true;
    }

    if (tryHarvest) {
        rigiSell();
        Game.computeLumpTimes();
        // Use a variable for ripe check for clarity
        const lumpIsRipe = Date.now() - started >= Math.ceil(Game.lumpRipeAge);
        if (lumpIsRipe) {
            if (Game.dragonLevel >= 21 && FrozenCookies.dragonsCurve) {
                autoDragonsCurve();
            } else {
                Game.clickLump();
            }
            logEvent("autoRigidel", "Sugar lump harvested early");
        } else {
            logEvent("autoRigidel", "Suppressed early harvest of unripe sugar lump");
        }
    }

    // Restore previous god if we swapped Rigidel in
    if (prevGod !== -1) swapIn(prevGod, PANTHEON_SLOT_DIAMOND);
}

function autoDragonsCurve() {
    // Swap dragon auras to try for unusual lumps.
    if (Game.dragonLevel < 21 || FrozenCookies.dragonsCurve < 1) return;

    var shouldRestoreAutoDragonToggle = suspendAutoDragonToggle();

    if (Game.dragonLevel > 26 && !Game.hasAura("Dragon's Curve")) {
        setDragonAuraWithConfirmation(
            DRAGON_AURA_DRAGONS_CURVE,
            Game.dragonAura === DRAGON_AURA_REALITY_BENDING ? 1 : 0,
            {
                logCategory: "autoDragonsCurve",
                logMessage: "Dragon auras swapped to manipulate new Sugar Lump",
            },
        );
    } else if (!Game.hasAura("Dragon's Curve")) {
        setDragonAuraWithConfirmation(DRAGON_AURA_DRAGONS_CURVE, 0, {
            logCategory: "autoDragonsCurve",
            logMessage: "Dragon auras swapped to manipulate new Sugar Lump",
        });
    }

    if (FrozenCookies.dragonsCurve === 2 && Game.dragonLevel > 26 && !Game.hasAura("Reality Bending")) {
        setDragonAuraWithConfirmation(
            DRAGON_AURA_REALITY_BENDING,
            Game.dragonAura === DRAGON_AURA_DRAGONS_CURVE ? 1 : 0,
        );
    }

    Game.clickLump();
    restoreAutoDragonToggle(shouldRestoreAutoDragonToggle);
}

function autoDragonAction() {
    if (!Game.HasUnlocked("A crumbly egg") || Game.dragonLevel > 26 || hasClickBuff()) {
        return;
    }

    if (Game.HasUnlocked("A crumbly egg") && !Game.Has("A crumbly egg")) {
        Game.Upgrades["A crumbly egg"].buy();
        logEvent("autoDragon", "Bought an egg");
    }

    if (Game.dragonLevel < Game.dragonLevels.length - 1 && Game.dragonLevels[Game.dragonLevel].cost()) {
        Game.specialTab = "dragon";
        Game.UpgradeDragon();
        if (Game.dragonLevel + 1 >= Game.dragonLevels.length) Game.ToggleSpecialMenu();
        logEvent("autoDragon", "Upgraded the dragon to level " + Game.dragonLevel);
    }
}

function petDragonAction() {
    if (!Game.Has("A crumbly egg") || Game.dragonLevel < 4 || !Game.Has("Pet the dragon") || hasClickBuff()) {
        return;
    }

    //Calculate current pet drop and if we have it
    Math.seedrandom(Game.seed + "/dragonTime");
    let drops = ["Dragon scale", "Dragon claw", "Dragon fang", "Dragon teddy bear"];
    drops = shuffle(drops);
    Math.seedrandom();
    let currentDrop = drops[Math.floor((new Date().getMinutes() / 60) * drops.length)];

    //Pet the dragon
    if (!Game.Has(currentDrop) && !Game.HasUnlocked(currentDrop)) {
        Game.specialTab = "dragon";
        Game.ToggleSpecialMenu(1);
        Game.ClickSpecialPic();
        Game.ToggleSpecialMenu(0);
        //logEvent("autoDragon", "Who's a good dragon? You are!");
    }
}

function autoDragonAura0Action() {
    if (
        !Game.Has("A crumbly egg") ||
        Game.dragonLevel < 5 ||
        !FrozenCookies.autoDragonAura0 ||
        !FrozenCookies.autoDragonToggle ||
        Game.dragonAura === FrozenCookies.autoDragonAura0 ||
        Game.dragonAura2 === FrozenCookies.autoDragonAura0
    ) {
        return;
    }

    if (FrozenCookies.autoDragonAura0 === FrozenCookies.autoDragonAura1) {
        FrozenCookies.autoDragonAura1 = 0;
        logEvent("autoDragon", "Can't set both auras to the same one!");
        return;
    }

    if (
        Game.dragonLevel > 26 &&
        Game.dragonAura === FrozenCookies.autoDragonAura1 &&
        Game.dragonAura2 !== FrozenCookies.autoDragonAura0
    ) {
        setDragonAuraWithConfirmation(FrozenCookies.autoDragonAura0, 1, {
            logMessage: "Set first dragon aura",
        });
        return;
    } else if (Game.dragonLevel >= FrozenCookies.autoDragonAura0 + 4) {
        setDragonAuraWithConfirmation(FrozenCookies.autoDragonAura0, 0, {
            closeMenu: true,
            logMessage: "Set first dragon aura",
        });
        return;
    }
}

function autoDragonAura1Action() {
    if (
        !Game.Has("A crumbly egg") ||
        Game.dragonLevel < 27 ||
        !FrozenCookies.autoDragonAura0 ||
        !FrozenCookies.autoDragonAura1 ||
        !FrozenCookies.autoDragonToggle ||
        Game.dragonAura === FrozenCookies.autoDragonAura1 ||
        Game.dragonAura2 === FrozenCookies.autoDragonAura1
    ) {
        return;
    }

    if (Game.dragonAura2 === FrozenCookies.autoDragonAura0 && Game.dragonAura !== FrozenCookies.autoDragonAura1) {
        setDragonAuraWithConfirmation(FrozenCookies.autoDragonAura1, 0, {
            logMessage: "Set second dragon aura",
        });
        return;
    } else if (
        Game.dragonAura === FrozenCookies.autoDragonAura0 &&
        Game.dragonAura2 !== FrozenCookies.autoDragonAura1
    ) {
        setDragonAuraWithConfirmation(FrozenCookies.autoDragonAura1, 1, {
            closeMenu: true,
            logMessage: "Set second dragon aura",
        });
        return;
    }
}

function autoDragonOrbsAction() {
    if (!T) return;
    var you = Game.Objects["You"];
    if (FrozenCookies.autoDragonOrbs === 1 && (!Game.hasAura("Dragon Orbs") || Game.hasGod("ruin") || you.amount < 1)) {
        FrozenCookies.autoDragonOrbs = 0;
        logEvent("autoDragonOrbs", "Not currently possible to use Dragon Orbs");
    }

    var hasActiveBuffs = Object.keys(Game.buffs).length > 0;
    if (!goldenCookieLife() && Game.hasAura("Dragon Orbs") && !hasActiveBuffs) {
        you.sell(1);
        logEvent(
            "autoDragonOrbs",
            "Sold 1 You for " + (Beautify(you.price * you.getSellMultiplier()) + " cookies and a wish"),
        );
    }
}
