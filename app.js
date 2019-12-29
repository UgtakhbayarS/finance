//Дэлгэцтэй ажиллах контроллер
var uiController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDesctiption: ".add__description",
    inputValue: ".add__value",
    addButton: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    tusuvLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month"
  };

  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatMoney = function(too, type) {
    var too = "" + too;
    var a = too
      .split("")
      .reverse()
      .join("");
    var y = "";
    var count = 1;
    for (var i = 0; i < a.length; i++) {
      y = y + a[i];
      if (count % 3 === 0) {
        y = y + ",";
      }
      count++;
    }
    var z = y
      .split("")
      .reverse()
      .join("");
    if (z[0] === ",") {
      z = z.substring(1, z.length - 1);
    }
    if (type === "inc") {
      z = "+ " + z;
    } else {
      z = "- " + z;
    }
    return z;
  };

  return {
    displayDate: function() {
      var unuudur = new Date();
      document.querySelector(DOMstrings.dateLabel).textContent =
        unuudur.getFullYear() + " оны " + unuudur.getMonth() + " сарын ";
    },

    changeType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDesctiption +
          ", " +
          DOMstrings.inputValue
      );

      nodeListForEach(fields, function(el) {
        el.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.addButton).classList.toggle("red");
    },

    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc exp
        decription: document.querySelector(DOMstrings.inputDesctiption).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    displayPercentages: function(allPercentages) {
      var elements = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );
      nodeListForEach(elements, function(el, index) {
        el.textContent = allPercentages[index] + "%";
      });
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
    tusuvUzuuleh: function(tusuv) {
      var type;
      if (tusuv.tusuv > 0) {
        type = "inc";
      } else {
        type = "exp";
      }
      document.querySelector(DOMstrings.tusuvLabel).textContent = formatMoney(
        tusuv.tusuv,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatMoney(
        tusuv.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatMoney(tusuv.totalExp, "exp");
      document.querySelector(DOMstrings.percentageLabel).textContent =
        tusuv.huvi + "%";
    },

    deleteListItem: function(id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    addListItem: function(item, type) {
      //Орлого зарлагын элемэнтийг агуулсан HTML -ийг бэлтгэнэ.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%DESCRIPTION%</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //ТЭр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглан өөрчлөх
      html = html.replace("%id%", item.id);
      html = html.replace("%DESCRIPTION%", item.description); //decription
      html = html.replace("$$VALUE$$", formatMoney(item.value, type));
      //Бэлтгэсэн HTML ээ DOM руу хийж өгнө.
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
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = 0;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
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
      if (data.totals.inc > 0) {
        data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.huvi = 0;
      }
    },

    calculatePercentages: function() {
      data.items.exp.forEach(function(el) {
        el.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPercentages = data.items.exp.map(function(el) {
        return el.getPercentage();
      });

      return allPercentages;
    },

    tusuviigAvah: function() {
      return {
        tusuv: data.tusuv,
        huvi: data.huvi,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp
      };
    },

    deleteItem: function(type, id) {
      var ids = data.items[type].map(function(el) {
        return el.id;
      });
      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
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
      updateTusuv();
    }
  };

  var updateTusuv = function() {
    financeController.tusuvTsootsooloh();
    //5. Эцсийн үлдэгдэл, тооцоог
    var tusuv = financeController.tusuviigAvah();
    //6. Төсвийг тооцоог дэлгэцэнд гаргана.
    uiController.tusuvUzuuleh(tusuv);
    // console.log(tusuv);
    //7. Every Element calculation
    financeController.calculatePercentages();
    //8. Every Element Get
    var allPercentages = financeController.getPercentages();
    //9. Every Element Display
    console.log(allPercentages);
    uiController.displayPercentages(allPercentages);
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

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);

    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function(event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (id) {
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);
          // console.log(type + " ==> " + itemId);
          //1.Finance Module Delete using type and id
          financeController.deleteItem(type, itemId);
          //2.Display module  Delete using type and id
          uiController.deleteListItem(id);
          //3. Uldegdel calculation redefine.
          updateTusuv();
        }
      });
  };

  return {
    init: function() {
      console.log("Application started...");
      uiController.displayDate();
      uiController.tusuvUzuuleh({
        tusuv: 0,
        huvi: 0,
        totalInc: 0,
        totalExp: 0
      });
      setupEventListeners();
    }
  };
})(uiController, financeController);

appController.init();
