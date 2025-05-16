export class LeagueOptions {
    static baron = {
        cardData: {
            title: "Barão Nashor",
            description: "Power Play! Barão já vai nascer.",
            iconUrl: "",
            accentColor: "#8B00FF"
        },
        spawnTime: 25 * 60,
        respawnTime: 5 * 60
    };

    static atakhan = {
        cardData: {
            title: "Atakhan",
            description: "Fique atento! Atakhan irá aparecer no mapa.",
            iconUrl: "",
            accentColor: "#FFB300"
        },
        spawnTime: 20 * 60
    };

    static dragon = {
        cardData: {
            title: "Dragão",
            description: "Conquiste o Dragão! Ele irá aparecer no mapa.",
            iconUrl: "",
            accentColor: "#FF0000"
        },
        spawnTime: 5 * 60,
        respawnTime: 5 * 60
    };

    static elder = {
        cardData: {
            title: "Dragão Ancião",
            description: "Match point, Dragão Ancião irá aparecer no mapa.",
            iconUrl: "",
            accentColor: "#FF5555"
        },
        respawnTime: 5 * 60
    };

    static riftherald = {
        cardData: {
            title: "Arauto do Vale",
            description: "Snowballe com o arauto!",
            iconUrl: "",
            accentColor: "#00BFFF"
        },
        spawnTime: 15 * 60
    };

    static grubs = {
        cardData: {
            title: "Vastilarvas nascendo",
            description: "Caso queira capitalizar melhor apos as kills!",
            iconUrl: "",
            accentColor: "#AA00FF"
        },
        spawnTime: 8 * 60
    };

    static earlygank = {
        cardData: {
            title: "Early Gank",
            description: "Cuidado com o gank após 2:15",
            iconUrl: "",
            accentColor: "#00ff00"
        },
        spawnTime: (2 * 60) + (30)
    };

    static full_clear_gank = {
        cardData: {
            title: "Gank full clear",
            description: "O jungler pode gankar antes ou depois do arongueijo!",
            iconUrl: "",
            accentColor: "#00ffaa"
        },
        spawnTime: 3 * 60
    };

    static second_clear_gank = {
        cardData: {
            title: "Gank segundo clear",
            description: "Cuidado, jungler pode gankar em breve!",
            iconUrl: "",
            accentColor: "#00aaff"
        },
        spawnTime: (5 * 60) + 15
    };
}