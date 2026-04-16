const PANTHEON_SLOT_DIAMOND = 0;
const PANTHEON_SLOT_RUBY = 1;
const PANTHEON_SLOT_JADE = 2;
const CYCLIUS_GOD_ID = 3;
const RIGIDEL_GOD_ID = 10;
const SCORN_GOD_ID = 11;
const DRAGON_AURA_DRAGONS_CURVE = 17;
const DRAGON_AURA_REALITY_BENDING = 18;
const CYCLIUS_TIMES = {
    ruby1: 1 * 60 + 12, // 1:12 UTC
    jade1: 4 * 60, // 4:00 UTC
    siJade: 6 * 60, // 6:00 UTC
    siRuby: 7 * 60 + 30, // 7:30 UTC
    diamond2: 9 * 60 + 19, // 9:19 UTC
    jade2: 10 * 60 + 20, // 10:20 UTC
    diamond3: 12 * 60, // 12:00 UTC
    ruby2: 13 * 60 + 12, // 13:12 UTC
    diamond4: 18 * 60, // 18:00 UTC
    cycNone1: 19 * 60 + 30, // 19:30 UTC
    diamond5: 21 * 60, // 21:00 UTC
    cycNone2: 22 * 60 + 30, // 22:30 UTC
};

const CYCLIUS_ASSIGNMENTS = {
    diamondRubyJade: [
        { preferenceSlot: PANTHEON_SLOT_DIAMOND, targetSlot: PANTHEON_SLOT_DIAMOND, label: "DIAMOND" },
        { preferenceSlot: PANTHEON_SLOT_RUBY, targetSlot: PANTHEON_SLOT_RUBY, label: "RUBY" },
        { preferenceSlot: PANTHEON_SLOT_JADE, targetSlot: PANTHEON_SLOT_JADE, label: "JADE" },
    ],
    diamondRubyJadeSi: [
        { preferenceSlot: PANTHEON_SLOT_DIAMOND, targetSlot: PANTHEON_SLOT_DIAMOND, label: "DIAMOND (SI)" },
        { preferenceSlot: PANTHEON_SLOT_RUBY, targetSlot: PANTHEON_SLOT_RUBY, label: "RUBY" },
        { preferenceSlot: PANTHEON_SLOT_JADE, targetSlot: PANTHEON_SLOT_JADE, label: "JADE" },
    ],
    diamondRuby: [
        { preferenceSlot: PANTHEON_SLOT_DIAMOND, targetSlot: PANTHEON_SLOT_DIAMOND, label: "DIAMOND" },
        { preferenceSlot: PANTHEON_SLOT_RUBY, targetSlot: PANTHEON_SLOT_RUBY, label: "RUBY" },
    ],
    diamondJade: [
        { preferenceSlot: PANTHEON_SLOT_DIAMOND, targetSlot: PANTHEON_SLOT_DIAMOND, label: "DIAMOND" },
        { preferenceSlot: PANTHEON_SLOT_RUBY, targetSlot: PANTHEON_SLOT_JADE, label: "JADE" },
    ],
    rubyJade: [
        { preferenceSlot: PANTHEON_SLOT_DIAMOND, targetSlot: PANTHEON_SLOT_RUBY, label: "RUBY" },
        { preferenceSlot: PANTHEON_SLOT_RUBY, targetSlot: PANTHEON_SLOT_JADE, label: "JADE" },
    ],
};

const CYCLIUS_SCHEDULES = {
    twoSlots: [
        {
            until: CYCLIUS_TIMES.jade1,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: CYCLIUS_TIMES.diamond3,
            cycliusSlot: PANTHEON_SLOT_JADE,
            message: "Putting Cyclius in JADE",
            assignments: CYCLIUS_ASSIGNMENTS.diamondRuby,
        },
        {
            until: CYCLIUS_TIMES.diamond4,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: Number.POSITIVE_INFINITY,
            cycliusSlot: null,
            assignments: CYCLIUS_ASSIGNMENTS.diamondRubyJade,
        },
    ],
    threeSlots: [
        {
            until: CYCLIUS_TIMES.ruby1,
            cycliusSlot: PANTHEON_SLOT_DIAMOND,
            message: "Putting Cyclius in DIAMOND",
            assignments: CYCLIUS_ASSIGNMENTS.rubyJade,
        },
        {
            until: CYCLIUS_TIMES.jade1,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: CYCLIUS_TIMES.diamond2,
            cycliusSlot: PANTHEON_SLOT_JADE,
            message: "Putting Cyclius in JADE",
            assignments: CYCLIUS_ASSIGNMENTS.diamondRuby,
        },
        {
            until: CYCLIUS_TIMES.jade2,
            cycliusSlot: PANTHEON_SLOT_DIAMOND,
            message: "Putting Cyclius in DIAMOND",
            assignments: CYCLIUS_ASSIGNMENTS.rubyJade,
        },
        {
            until: CYCLIUS_TIMES.diamond3,
            cycliusSlot: PANTHEON_SLOT_JADE,
            message: "Putting Cyclius in JADE",
            assignments: CYCLIUS_ASSIGNMENTS.diamondRuby,
        },
        {
            until: CYCLIUS_TIMES.ruby2,
            cycliusSlot: PANTHEON_SLOT_DIAMOND,
            message: "Putting Cyclius in DIAMOND",
            assignments: CYCLIUS_ASSIGNMENTS.rubyJade,
        },
        {
            until: CYCLIUS_TIMES.diamond4,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: CYCLIUS_TIMES.cycNone1,
            cycliusSlot: PANTHEON_SLOT_DIAMOND,
            message: "Putting Cyclius in DIAMOND",
            assignments: CYCLIUS_ASSIGNMENTS.rubyJade,
        },
        {
            until: CYCLIUS_TIMES.diamond5,
            cycliusSlot: null,
            assignments: CYCLIUS_ASSIGNMENTS.diamondRubyJade,
        },
        {
            until: CYCLIUS_TIMES.cycNone2,
            cycliusSlot: PANTHEON_SLOT_DIAMOND,
            message: "Putting Cyclius in DIAMOND",
            assignments: CYCLIUS_ASSIGNMENTS.rubyJade,
        },
        {
            until: Number.POSITIVE_INFINITY,
            cycliusSlot: null,
            assignments: CYCLIUS_ASSIGNMENTS.diamondRubyJade,
        },
    ],
    supremeIntellect: [
        {
            until: CYCLIUS_TIMES.ruby1,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY (SI)",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: CYCLIUS_TIMES.siJade,
            cycliusSlot: PANTHEON_SLOT_JADE,
            message: "Putting Cyclius in JADE (SI)",
            assignments: CYCLIUS_ASSIGNMENTS.diamondRuby,
        },
        {
            until: CYCLIUS_TIMES.siRuby,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY (SI)",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: CYCLIUS_TIMES.diamond2,
            cycliusSlot: null,
            assignments: CYCLIUS_ASSIGNMENTS.diamondRubyJadeSi,
        },
        {
            until: CYCLIUS_TIMES.jade2,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY (SI)",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: CYCLIUS_TIMES.diamond3,
            cycliusSlot: null,
            assignments: CYCLIUS_ASSIGNMENTS.diamondRubyJade,
        },
        {
            until: CYCLIUS_TIMES.ruby2,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY (SI)",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: CYCLIUS_TIMES.diamond4,
            cycliusSlot: PANTHEON_SLOT_JADE,
            message: "Putting Cyclius in JADE (SI)",
            assignments: CYCLIUS_ASSIGNMENTS.diamondRuby,
        },
        {
            until: CYCLIUS_TIMES.cycNone1,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY (SI)",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: CYCLIUS_TIMES.diamond5,
            cycliusSlot: null,
            assignments: CYCLIUS_ASSIGNMENTS.diamondRubyJade,
        },
        {
            until: CYCLIUS_TIMES.cycNone2,
            cycliusSlot: PANTHEON_SLOT_RUBY,
            message: "Putting Cyclius in RUBY (SI)",
            assignments: CYCLIUS_ASSIGNMENTS.diamondJade,
        },
        {
            until: Number.POSITIVE_INFINITY,
            cycliusSlot: null,
            assignments: CYCLIUS_ASSIGNMENTS.diamondRubyJade,
        },
    ],
};

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

    // Get current UTC time in minutes.
    const now = new Date();
    const currentTime = now.getUTCHours() * 60 + now.getUTCMinutes();
    var schedule = hasSupremeIntellect
        ? CYCLIUS_SCHEDULES.supremeIntellect
        : FrozenCookies.autoCyclius === 1
          ? CYCLIUS_SCHEDULES.twoSlots
          : CYCLIUS_SCHEDULES.threeSlots;

    function getActiveCycliusState() {
        for (var i = 0; i < schedule.length; i++) {
            if (currentTime < schedule[i].until) {
                return schedule[i];
            }
        }
        return schedule[schedule.length - 1];
    }

    function placeCycliusIfNeeded(state) {
        if (state.cycliusSlot == null) {
            removeCycliusIfPresent();
            return;
        }

        if (canManagePantheon() && T.slot[state.cycliusSlot] !== CYCLIUS_GOD_ID) {
            swapIn(CYCLIUS_GOD_ID, state.cycliusSlot);
            logEvent("autoCyclius", state.message);
        }
    }

    function applyWorshipAssignments(assignments) {
        assignments.forEach(function (assignment) {
            swapPantheonGodIfNeeded(
                getAutoWorshipPreference(assignment.preferenceSlot),
                assignment.targetSlot,
                assignment.label,
            );
        });
    }

    var activeState = getActiveCycliusState();
    if (!activeState) {
        return;
    }

    placeCycliusIfNeeded(activeState);
    applyWorshipAssignments(activeState.assignments);
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
