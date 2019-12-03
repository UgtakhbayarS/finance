//Дэлгэцтэй ажиллах контроллер
var uiController = (function() {})();

//Санхүүтэй ажиллах контроллер
var financeController = (function() {})();

//Программын холбогч контроллер
var appController = (function(uiController, fnController) {
  var ctrlAddItem = function() {
    console.log("Дэлгэцээс өгөгдөл авах хэсэг");
  };

  document.querySelector(".add__btn").addEventListener("click", function() {
    //1. Оруулах өгөгдлийг дэлгэцээс олж авна.
    ctrlAddItem();
    //2. Олж авсан өгөдлүүдээ санхүүгийн  контроллерт дамжуулж тэнд хадгална.
    //3. Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана.
    //4. Төсвийг тооцно.
    //5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
  });

  document.addEventListener("keypress", function(event) {
    if (event.keyCode === 13 || event.which === 13) {
      ctrlAddItem();
    }
  });
})(uiController, financeController);
