
(function ($) {
  $(document).ready(function () {
    var jwt ;
    getJWT().then(function (res) {
        console.log(res)
        jwt = res.data[0].jwt
    }, function (errRes) {
        console.error("Failed getting JWT " + errRes)
    });
    console.log(jwt);
    function assertion(options, callback) {
        options.assertion = jwt;
        options.handleError = koreBot.showError;
        options.chatHistory = koreBot.chatHistory;
        options.botDetails = koreBot.botDetails;
        callback(null, options);
        setTimeout(function () {
            if (koreBot && koreBot.initToken) {
                koreBot.initToken(options);
            }
        }, 2000);
    }


   
    function getJWT(options, callback) {
      var urlParams = new URLSearchParams(window.location.search);
      var id = urlParams.get("id");
      var url = "http://localhost:8080/user/" + id;
      console.log(url);
      return $.ajax({
        url: url,
        type: "get",
        dataType: "json",
        success: function (data) {
        },
        error: function (err) {},
      });
    }
    function getBrandingInformation(options) {
      if (chatConfig.botOptions.enableThemes) {
        var brandingAPIUrl = (
          chatConfig.botOptions.brandingAPIUrl || ""
        ).replace(":appId", chatConfig.botOptions.botInfo._id);
        $.ajax({
          url: brandingAPIUrl,
          headers: {
            Authorization: "bearer " + options.authorization.accessToken,
          },
          type: "get",
          dataType: "json",
          success: function (data) {
            if (koreBot && koreBot.applySDKBranding) {
              koreBot.applySDKBranding(data);
            }
            if (koreBot && koreBot.initToken) {
              koreBot.initToken(options);
            }
          },
          error: function (err) {
            console.log(err);
          },
        });
      }
    }
    function onJWTGrantSuccess(options) {
      getBrandingInformation(options);
    }

    var widgetsConfig = window.KoreSDK.widgetsConfig;

    var wizSelector = {
      menu: ".kr-wiz-menu-chat",
      content: ".kr-wiz-content-chat",
    };
    var wSdk = new KoreWidgetSDK(widgetsConfig);

    getJWT().then(function (res) {
        console.log(res)
        jwt = res.data[0].jwt
        console.log(jwt)
        wSdk.setJWT(jwt);
        wSdk.show(widgetsConfig, wizSelector);
    }, function (errRes) {
        console.error("Failed getting JWT " + errRes)
    });
    // console.log(jwt);
    // wSdk.setJWT(jwt);
    // wSdk.show(widgetsConfig, wizSelector);

    //chat window
    var chatConfig = window.KoreSDK.chatConfig;
    chatConfig.botOptions.assertionFn = assertion;
    chatConfig.botOptions.jwtgrantSuccessCB = onJWTGrantSuccess;
    chatConfig.widgetSDKInstace = wSdk; //passing widget sdk instance to chatwindow

    var koreBot = koreBotChat();
    koreBot.show(chatConfig);

    $(".openChatWindow").click(function () {
      koreBot.show(chatConfig);
    });
  });
})(
  jQuery ||
    (window.KoreSDK &&
      window.KoreSDK.dependencies &&
      window.KoreSDK.dependencies.jQuery)
);
