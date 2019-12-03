//Дэлгэцтэй ажиллах контроллер
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesctiption: ".add__description",
    inputValue: ".add__value",
    addButton: ".add__btn"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc exp
        decription: document.querySelector(DOMstrings.inputDesctiption).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//Санхүүтэй ажиллах контроллер
var financeController = (function() {
  var Income = function(id, description, value) {
    this.id = id;
    this.decription = description;
    this.value = value;
  };
  var Expense = function(id, description, value) {
    this.id = id;
    this.decription = description;
    this.value = value;
  };

  var data = {
    items: {
      inc: [],
      exp: []
    },

    totals: {
      inc: 0,
      exp: 0
    }
  };

  return {
    addItem: function(type, desc, val) {
      var item, id;

      //[1,2,3,4]
      if (data.items[type].length === 0) {
        id = 1;
      } else {
        id = data.items[type][data.item[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }
      data.items[type].push(item);
    },

    seeData: function() {
      return data;
    }
  };
})();

//Программын холбогч контроллер
var appController = (function(uiController, fnController) {
  var ctrlAddItem = function() {
    //1. Оруулах өгөгдлийг дэлгэцээс олж авна.
    var input = uiController.getInput();
    //2. Олж авсан өгөдлүүдээ санхүүгийн  контроллерт дамжуулж тэнд хадгална.
    financeController.addItem(input.type, input.decription, input.value);
  };

  var setupEventListeners = function() {
    //DOM
    var DOM = uiController.getDOMstrings();
    document.querySelector(DOM.addButton).addEventListener("click", function() {
      ctrlAddItem();
      //3. Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана.
      //4. Төсвийг тооцно.
      //5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
    });

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  return {
    init: function() {
      console.log("Application started...");
      setupEventListeners();
    }
  };
})(uiController, financeController);

appController.init();
