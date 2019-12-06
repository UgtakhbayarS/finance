//Дэлгэцтэй ажиллах контроллер
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesctiption: ".add__description",
    inputValue: ".add__value",
    addButton: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc exp
        decription: document.querySelector(DOMstrings.inputDesctiption).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    getDOMstrings: function() {
      return DOMstrings;
    },

    clearFields: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputDesctiption + ", " + DOMstrings.inputValue
      );
      //Convert to Array
      var fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(el, index, array) {
        el.value = "";
      });
      fieldsArr[0].focus();
      // for (var i = 0; i < fieldsArr.length; i++) {
      //   fieldsArr[i].value = "";
      // }
    },

    addListItem: function(item, type) {
      //Орлого зарлагын элемэнтийг агуулсан HTML -ийг бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">+ $$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">- $$VALUE$$</div><div class="item__percentage">$$percent$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //ТЭр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглан өөрчлөх
      html = html.replace("%id%", item.id);
      html = html.replace("%DESCRIPTION%", item.description); //decription
      html = html.replace("$$VALUE$$", item.value);
      html = html.replace("$$percent$$", item.value);
      //Бэлтгэсэн HTML  ээ DOM руу хийж өгнө.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    }
  };
})();

//Санхүүтэй ажиллах контроллер
var financeController = (function() {
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
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
    },
    tusuv: 0,
    huvi: 0
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.items[type].forEach(function(el) {
      sum += el.value;
    });
    data.totals[type] = sum;
  };

  return {
    tusuvTsootsooloh: function() {
      calculateTotal("inc");
      calculateTotal("exp");
      //Total Busget
      data.tusuv = data.totals.inc - data.totals.exp;
      //Deposit and expense percent
      data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    tusuviigAvah: function() {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      };
    },

    addItem: function(type, desc, val) {
      var item, id;
      //[1,2,3,4]
      if (data.items[type].length === 0) {
        id = 1;
      } else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expense(id, desc, val);
      }
      data.items[type].push(item);
      return item;
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
    if (input.description !== "" && input.value !== "") {
      //2. Олж авсан өгөдлүүдээ санхүүгийн  контроллерт дамжуулж тэнд хадгална.
      var item = financeController.addItem(
        input.type,
        input.decription,
        input.value
      );
      //3. Олж авсан өгөгдлүүдээ веб дээрээ тохирох хэсэгт нь гаргана.
      // console.log(item);
      uiController.addListItem(item, input.type);
      uiController.clearFields();
      //4. Төсвийг тооцно.
      financeController.tusuvTsootsooloh();
      //5. Эцсийн үлдэгдэл, тооцоог
      var tusuv = financeController.tusuviigAvah();
      console.log(tusuv);
      //6. Төсвийг тооцоог дэлгэцэнд гаргана.
    }
  };

  var setupEventListeners = function() {
    var DOM = uiController.getDOMstrings();
    document.querySelector(DOM.addButton).addEventListener("click", function() {
      ctrlAddItem();
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
