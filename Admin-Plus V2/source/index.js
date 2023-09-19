const { Client: AttClient } = require('att-client');
const { attConfig, userConfig } = require('./UserLogin');
const bot = new AttClient(attConfig);
const username = userConfig.playerUsername;

function jsonContainsString(obj, searchString) {
    if (typeof obj === 'string') {
      if (obj.indexOf(searchString) !== -1) {
        return true;
      }
    }
  
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        if (jsonContainsString(obj[i], searchString)) {
          return true;
        }
      }
    }
  
    if (typeof obj === 'object' && obj !== null) {
      for (let key in obj) {
        if (jsonContainsString(obj[key], searchString)) {
          return true;
        }
      }
    }
    return false;
} 

const killMessages = ["AHHHHH", "I had a wife and 2 kids...", "What have you done?", "Why did you do this to me..?", "I just wanted to live...", "How could you?", "You're a monster...", "(Death sounds)", "NOOOOO!", "I DON'T WANNA DIE!", "I'm just a mushroom guy... How could you?"];
const mrMushroomHit = [];

var selected = [];
var trapped = [];
var teleport = false;
var killNum = 0;
var deselectMode = false;

var killedSprig = false;
var offMode = true;
var selectMode = false;

bot.on('connect', async (connection) => {
    connection.send(`player message * "SorpoBot is ready..." 3`);
    console.log(`connected to ${connection.server.name}`);
    
    setInterval(function() {        

        connection.send(`player inventory "${username}"`).then(resp => {
            connection.send(`player detailed "${username}"`).then(resp2 => {
                
                if (resp && resp.data.Result[0] && resp.data.Result[0]) {
                    const Rhand = jsonContainsString(resp.data.Result[0].RightHand, " ");

                    const holdingSwordL = jsonContainsString(resp.data.Result[0].LeftHand, "Crystal Sword Blue");

                    const tpeR = jsonContainsString(resp.data.Result[0].RightHand, "Potion Medium");
                    const tpeL = jsonContainsString(resp.data.Result[0].LeftHand, "Crystal Gem Blue");

                    const tpMeR = jsonContainsString(resp.data.Result[0].RightHand, "Crystal Gem Blue");
                    const tpMeL = jsonContainsString(resp.data.Result[0].LeftHand, "Potion Medium");

                    const bladeOfDeathR = jsonContainsString(resp.data.Result[0].RightHand, "Crystal Sword Blue");

                    const slow = jsonContainsString(resp.data.Result[0].RightHand, "Dais Meat Half Cooked");
                    const speed = jsonContainsString(resp.data.Result[0].LeftHand, "Dais Meat Half Cooked");

                    const holdingSpoon = jsonContainsString(resp.data.Result[0].RightHand, "Wooden Stirring Spoon");

                    const smelterGem1 = jsonContainsString(resp.data.Result[0].RightHand, "Smelter Gem 1");
                    const smelterGem2 = jsonContainsString(resp.data.Result[0].RightHand, "Smelter Gem 2");
                    const smelterGem3 = jsonContainsString(resp.data.Result[0].RightHand, "Smelter Gem 3");

                    const holdingBlueFeatherR = jsonContainsString(resp.data.Result[0].RightHand, "Spriggull Feather Blue");

                    const holdingKeyR = jsonContainsString(resp.data.Result[0].RightHand, "Key Standard");

                    const guardHandleR = jsonContainsString(resp.data.Result[0].RightHand, "Guard Handle");
                    const guardHandleL = jsonContainsString(resp.data.Result[0].LeftHand, "Guard Handle");

                    const torchR = jsonContainsString(resp.data.Result[0].RightHand, "Torch");

                    

                    //Flash effect
                    if (tpeL && torchR && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Started flashing you (Pun intended)`);
                        connection.send(`player message "${username}" "Activated" 2`);

                        setInterval(function() {
                            connection.send(`player modify-stat "${username}" luminosity -15 0.5`);
                        }, 1000);
                        
                    }

                    //Forge all blades
                    if (tpeL && guardHandleR && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Forged all blades`);
                        connection.send(`player message "${username}" "Activated" 2`);
                        connection.send(`progress forgeall`);
                    }

                    //Dupe righthand item items
                    if (guardHandleL && Rhand && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1] && resp.data.Result[0]) {
                        console.log(`Duped righthand item`);
                        connection.send(`player message "${username}" "Activated" 2`);
                        if (resp.data.Result[0].RightHand) {
                            connection.send(`trade post ${username} ${resp.data.Result[0].RightHand.PrefabHash}`);
                        }
                    }

                    //Give stats
                    if (holdingSwordL && resp.data.Result[0].LeftHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Gave stats`);
                        connection.send(`player message "${username}" "Activated" 2`);
                        connection.send(`player set-stat "${username}" speed 4`);
                        connection.send(`player god-mode "${username}" true`);
                    }

                    //Chaos teleport
                    if (holdingKeyR && tpeL && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {   
                        console.log(`Activated chaos teleport`);
                        if (!teleport) {
                            teleport = true;
                            connection.send(`player message "${username}" "Activated" 2`);
                        } else {
                            teleport = false
                            connection.send(`player message "${username}" "Deactivated" 2`);
                        }
                        
                    }

                    //Spawn spriggull
                    if (tpeL && holdingBlueFeatherR && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Spawned spriggull`);
                        connection.send(`player message "${username}" "Activated" 2`);
                        connection.send(`trade post "${username}" Spriggull`);
                    }

                    //Teleport selected to me
                    if (tpeL && tpeR && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Teleported selected to you`);
                        connection.send(`player message "${username}" "Activated" 2`);
                        while (killNum != selected.length) {
                            connection.send(`player teleport ${selected[killNum]} "${username}"`);
                            killNum++;
                        }
                        if (killNum === selected.length) {
                            killNum = 0;
                        }
                    }

                    //Kill all selected
                    if (bladeOfDeathR && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Killed selected`);
                        connection.send(`player message "${username}" "Activated" 2`);

                        while (killNum != selected.length) {
                            connection.send(`player kill ${selected[killNum]}`);
                            killNum++;
                        }
                        if (killNum === selected.length) {
                            killNum = 0;
                        }
                    }

                    //Slow mode
                    if (slow && tpeL && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Slowed selected`);
                        connection.send(`player message "${username}" "Activated" 2`);

                        while (killNum != selected.length) {
                            connection.send(`player modify-stat ${selected[killNum]} speed 99999999999999999999 20`);
                            killNum++;
                        }
                        if (killNum === selected.length) {
                            killNum = 0;
                        }
                    
                    }

                    //Speed mode
                    if (speed && tpMeR && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Gave speed to selected`);
                        connection.send(`player message "${username}" "Activated" 2`);

                        for (var i = 0; i != selected.length; i++) {
                            connection.send(`player modify-stat ${selected[i]} speed 15 20`);
                        }
                    
                    }

                    //Give heart gloves
                    if (holdingSpoon && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Gave everyone heart gloves`);
                        connection.send(`player message "${username}" "Activated" 2`);

                        connection.send(`festivities start 55286`);
                    }

                    //Teleport me to selected
                    if (tpMeL && tpMeR && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1] && selected.length === 1) {
                        console.log(`Teleported you to selected`);
                        connection.send(`player message "${username}" "Activated" 2`);
                        connection.send(`player teleport "${username}" ${selected[0]}`);
                    }

                    //Clear selection
                    if (tpeL && tpMeR && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1] && resp.data.Result[0].LeftHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Cleared selected`);
                        connection.send(`player message "${username}" "Cleared Selection" 3`);
                        for (var i = 0; i != selected.length; i++) {
                            connection.send(`player message ${selected[i]} "You have been unselected..."`);
                        }
                        selected = [];
                    }

                    //Fall mode
                    if (tpeL && smelterGem3 && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1] && selected.length === 1) {
                        console.log(`Flung selected`);
                        connection.send(`player message "${username}" "Activated" 2`);

                        connection.send(`player set-home ${selected[0]} -694.978,800.000,89.285`);
                        connection.send(`player teleport ${selected[0]} home`);
                        connection.send(`player set-home ${selected[0]} -689.292,129.249008,72.125`);
                        connection.send(`player message ${selected[0]} "Imagine being in the air."`);
                        
                        setTimeout(function() {
                            connection.send(`player teleport ${selected[0]} home`);
                            connection.send(`player message ${selected[0]} "Couldn't be me." 3`);
                        }, 12000);
                    }

                    //Teleport everyone selected to climbing tower
                    if (tpeL && smelterGem2 && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Teleported you and selected to top of tower`);
                        connection.send(`player message "${username}" "Activated" 2`);
                        connection.send(`player teleport "${username}" TowerEnd`);

                        for (var i = 0; i != selected.length; i++) {
                            connection.send(`player teleport ${selected[killNum]} TowerEnd`);
                            killNum++;
                        }

                    }

                    //Chunk locking
                    if (tpeL && smelterGem1 && resp.data.Result[0].RightHand.Position[1] > resp2.data.Result.HeadPosition[1] && selected.length === 1) {
                        console.log(`Chunk locked selected`);
                        connection.send(`player message "${username}" "Activated" 2`);
                        var istrapped = true
                        if (trapped.length > 0) {
                            trapped = [];
                            istrapped = false;
                            for (let i = 0; i < selected.length; i++) {
                                connection.send(`player set-home ${selected[i]} -689.292,129.249008,72.125`);
                                trapped = [];
                            }
                            killNum = 0;
                        }
                        
                        for (; killNum < selected.length && istrapped; killNum++) {
                            trapped.push(selected[killNum]);
                            connection.send(`player detailed "${selected[killNum]}"`).then(resp3 => {
                                if (resp3.data.Result) {
                                    const positionWW = JSON.stringify(resp3.data.Result.Position).replace(/[\[\]\s]+/g, '');
                                    connection.send(`player set-home ${selected[killNum]} ${positionWW}`);
                                }
                            });
                        }
                        killNum = 0;
                    }
                    
                    //Self teleport
                    if (jsonContainsString(resp.data.Result[0].LeftHand, "Potion Medium") && resp.data.Result[0].LeftHand.Position[1] > resp2.data.Result.HeadPosition[1]) {
                        console.log(`Teleported you to spawn`);
                        connection.send(`player teleport "${username}" home`);
                    }
                }
            });
        });

    }, 3000);

    connection.subscribe("InventoryChanged", message => {
        const { User } = message.data;
        
        if (teleport) {
            connection.send(`player teleport "${username}" ${User.id}`);
        }
    });
    
    connection.subscribe("PlayerMovedChunk", message => {
        const { player } = message.data;
        
        if (teleport) {
            connection.send(`player teleport "${username}" ${player.id}`);
        }

        if (trapped.includes(player.id)) {
            connection.send(`player teleport ${player.id} home`);
            connection.send(`player message ${player.id} "You have been chunk locked" 4`);
        } 
    });

    connection.subscribe("PlayerLeft", message => {
        const { user } = message.data;

        if (selected.includes(user.id)) {
            selected.splice(selected.indexOf(user.id), 1);
        }
    });

    connection.subscribe("ObjectKilled", message => {
        const { name, killerPlayer } = message.data;

        if (killerPlayer && name) {

            if (teleport) {
                connection.send(`player teleport "${username}" ${killerPlayer.id}`);
            } 
            
            if (name.includes("Schmeechee")) {
                connection.send(`player message ${killerPlayer.id} "'${killMessages[Math.floor(Math.random() * killMessages.length)]}' - Schmeechee" 5`)
            } else if (killerPlayer.username === username && name.includes('Crystal')) {
                killedSprig = true;
                connection.send(`wacky destroy-free CrystalShardBlue`);
        
                if (selectMode && killedSprig) {
                    deselectMode = true;
                    selectMode = false;
                    killedSprig = false;
                    connection.send(`player message "${username}" "deselectMode" 3`);
                } else if (deselectMode && killedSprig) {
                    offMode = true;
                    deselectMode = false;
                    killedSprig = false;
                    connection.send(`player message "${username}" "offMode" 3`);
                } else if (offMode && killedSprig) {
                    selectMode = true;
                    offMode = false;
                    killedSprig = false;
                    connection.send(`player message "${username}" "selectMode" 3`);
                }
            }
        }
    });
    
    connection.subscribe('PlayerStateChanged', message => {
        const { user, state, isEnter } = message.data;
        
        if (teleport) {
            connection.send(`player teleport "${username}" ${user.id}`);
        } 
        
        if (state === 'Combat' && isEnter === true && user.username === username) {
            mrMushroomHit.push('Hit');
            setTimeout(function () {
                if (mrMushroomHit.includes('Hit')) {
                    mrMushroomHit.splice(mrMushroomHit.indexOf('Hit'), 1);
                }
            }, 500);
        }
        const hitPlayer = mrMushroomHit.includes('Hit') && !user.username.startsWith(username) && state === "Combat" && isEnter === true;

        if (hitPlayer && selectMode) {
            selected.push(user.id);
            connection.send(`player message ${user.id} "You have been selected..." 4`);
            connection.send(`player message "${username}" "${user.username} has been selected" 2`);
        
        } else if (hitPlayer && deselectMode) {
            selected.splice(selected.indexOf(user.id),);
            connection.send(`player message ${user.id} "You have been unselected..." 4`);
            connection.send(`player message "${username}" "${user.username} has been unselected" 2`);
        
        }

    });

});

bot.start();