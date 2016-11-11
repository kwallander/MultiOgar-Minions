// Project imports
var fs = require("fs");
var Logger = require('../modules/Logger');
var BotPlayer = require('./BotPlayer');
var MBotPlayer = require('./MPlayer');
var FakeSocket = require('./FakeSocket');
var PacketHandler = require('../PacketHandler');

function BotLoader(gameServer) {
    this.gameServer = gameServer;
    this.loadNames();
}

module.exports = BotLoader;

BotLoader.prototype.getName = function () {
    var name = "";
    
    // Picks a random name for the bot
    if (this.randomNames.length > 0) {
        var index = (this.randomNames.length * Math.random()) >>> 0;
        name = this.randomNames[index];
    } else {
        name = "bot" + ++this.nameIndex;
    }
    
    return name;
};

BotLoader.prototype.loadNames = function () {
    this.randomNames = [];
    
    if (fs.existsSync("./botnames.txt")) {
        // Read and parse the names - filter out whitespace-only names
        this.randomNames = fs.readFileSync("./botnames.txt", "utf8").split(/[\r\n]+/).filter(function (x) {
            return x != ''; // filter empty names
        });
    }
    this.nameIndex = 0;
};

BotLoader.prototype.addBot = function () {
    var s = new FakeSocket(this.gameServer);
    s.playerTracker = new BotPlayer(this.gameServer, s);
    s.packetHandler = new PacketHandler(this.gameServer, s);
    
    // Add to client list
    this.gameServer.clients.push(s);
    
    // Add to world
    s.packetHandler.setNickname(this.getName());
};

BotLoader.prototype.addMBot = function (owner, mname) {
    var s 			= new FakeSocket(this.gameServer);
    s.playerTracker = new MBotPlayer(this.gameServer, s);
    s.playerTracker.bots = 0;
    s.packetHandler = new PacketHandler(this.gameServer, s);
    s.playerTracker.startBots = false
    // Add to client list
    s.playerTracker.bots = 0;
    this.gameServer.clients.push(s);
    
    // Add to world
    s.packetHandler.setNickname('minion');
    s.playerTracker.bots = 0;
    s.playerTracker.owner = owner
};
