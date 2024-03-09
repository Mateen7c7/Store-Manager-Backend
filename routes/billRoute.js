const express = require("express");
const Bill = require("../modules/bill");
const Item = require("../modules/item");

const router = express.Router();

// handle bill
router.post("/", async (req, res) => {
  const newDate = new Date();

  // function to convert single digit to double digit used in time
  function convertToTwoDigit(number) {
    if (number < 10) {
      return "0" + number;
    } else {
      return number;
    }
  }
  const date = new Date(
    `${newDate.getFullYear()}-${convertToTwoDigit(
      newDate.getMonth() + 1
    )}-${convertToTwoDigit(newDate.getDate())}`
  );
  // console.log(date);

  const data = req.body.data;

  // function to update  quantity of item
  const UpdateItem = async (item) => {
    let UpdatedItem = await Item.findByIdAndUpdate(item.id, {
      quantity: item.quantity - item.tookQuantity,
    });
  };

  data.map((obj) => {
    UpdateItem(obj);
  });

  const checkDateIsPresent = async (date) => {
    return await Bill.findOne({ date: date });
  };

  let billOnDate = await checkDateIsPresent(date);

  if (billOnDate) {
    // console.log(billOnDate);
    // console.log(data);

    let updatedExpense = billOnDate.expense;
    let updatedRevenue = billOnDate.revenue;
    let updatedSoldItems = billOnDate.soldItems.map((item) => {
      for (let i = 0; i < data.length; i++) {
        if (item.id == data[i].id) {
          updatedExpense =
            updatedExpense + data[i].tookQuantity * data[i].broughtPrice;
          updatedRevenue =
            updatedRevenue + data[i].tookQuantity * data[i].sellPrice;
          return {
            id: data[i].id,
            name: data[i].name,
            tookQuantity: data[i].tookQuantity + item.tookQuantity,
            category: data[i].category,
          };
        }
      }
    });
    data.map((item) => {
      let present = false;
      for (let i = 0; i < updatedSoldItems.length; i++) {
        if (item.id == updatedSoldItems[i].id) {
          present = true;
          break;
        }
      }
      if (!present) {
        updatedSoldItems.push({
          id: item.id,
          name: item.name,
          tookQuantity: item.tookQuantity,
          category: item.category,
        });
      }
    });
    // console.log(updatedSoldItems);
    updatedSoldItems = await Bill.findByIdAndUpdate(billOnDate._id, {
      soldItems: updatedSoldItems,
      expense: updatedExpense,
      revenue: updatedRevenue,
    });
    res.send(updatedSoldItems);
  } else {
    let expense = 0;
    let revenue = 0;
    let newBill = new Bill({
      date: date,
      soldItems: data.map((obj) => {
        expense = expense + obj.tookQuantity * obj.broughtPrice;
        revenue = revenue + obj.tookQuantity * obj.sellPrice;
        return {
          id: obj.id,
          name: obj.name,
          tookQuantity: obj.tookQuantity,
          category: obj.category,
        };
      }),
      expense,
      revenue,
    });
    await newBill.save();
    res.send(newBill);
  }

  try {
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

// Create new bill
router.post("/new", async (req, res) => {
  const data = req.body.data;
  let expense = 0;
  let revenue = 0;
  let newArr = data.map((obj) => {
    expense = expense + obj.tookQuantity * obj.broughtPrice;
    revenue = revenue + obj.tookQuantity * obj.sellPrice;
    return {
      id: obj.id,
      name: obj.name,
      tookQuantity: obj.tookQuantity,
      category: obj.category,
    };
  });
  const newBill = new Bill({
    date: new Date("2024-03-03"),
    soldItems: newArr,
    expense,
    revenue,
  });
  await newBill.save();
  res.send(newBill);
});
try {
} catch (error) {
  console.error(error);
  res.status(500).send(error);
}

module.exports = router;
