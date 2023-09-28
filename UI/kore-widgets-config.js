(function(KoreSDK){

    var KoreSDK=KoreSDK||{};

    var botOptionsWiz = {};
    botOptionsWiz.logLevel = 'debug';
    botOptionsWiz.koreAPIUrl = "https://bots.kore.ai";

    botOptionsWiz.JWTUrl = "PLEASE_ENTER_JWTURL_HERE";
    botOptionsWiz.userIdentity = 'PLEASE_ENTER_USER_EMAIL_ID';// Provide users email id here
    botOptionsWiz.botInfo = { name: "TravelPlanner", "_id": "st-3101255c-1be1-52ca-a35a-8e7ac2df5806" }; // bot name is case sensitive
    botOptionsWiz.clientId = "cs-d57d486c-77dd-577a-954b-88a2316ef76f";
    botOptionsWiz.clientSecret = "PLEASE_ENTER_CLIENT_SECRET";

    var widgetsConfig = {
        botOptions: botOptionsWiz
    };
    
    KoreSDK.widgetsConfig=widgetsConfig
})(window.KoreSDK);