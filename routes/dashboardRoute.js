const express = require("express");
const Bill = require("../modules/bill");
const Item = require("../modules/item");

const router = express.Router();

router.post("/", async (req, res) => {
  const from = req.body.from;
  const to = req.body.to;

  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    let arrOfDates = [];

    // function to add days to given date
    function addDays(date, days) {
      var result = new Date(date);
      result.setDate(result.getDate() + days);
      return result;
    }

    let date = fromDate;
    while (date <= toDate) {
      arrOfDates.push(date);
      date = addDays(date, 1);
    }

    let getBillFromDate = async (date) => {
      let bill = await Bill.findOne({ date: date });
      if (bill) {
        return bill;
      } else {
        return {
          date: date,
          soldItems: [],
          expense: 0,
          revenue: 0,
        };
      }
    };

    let getBills = await Promise.all(
      arrOfDates.map((date) => {
        return getBillFromDate(date);
      })
    );
    let itemsChart = [];
    let categoryChart = [];
    let profitChart = [];
    let totalExpense = 0;
    let totalRevenue = 0;

    // console.log("Bills", getBills);

    getBills.map((bill) => {
      if (bill) {
        totalExpense = totalExpense + bill.expense;
        totalRevenue = totalRevenue + bill.revenue;

        profitChart.push({
          date: bill.date,
          revenue: bill.revenue,
          expense: bill.expense,
          profit: bill.revenue - bill.expense,
        });
      }
    });

    // console.log("ProfitChart", profitChart);

    const allSoldItems = getBills.map((bill) => {
      if (bill) {
        return bill.soldItems;
      }
    });
    itemsChart = allSoldItems.flat();
    // console.log("ItemsChart", itemsChart);

    let updatedItemsChart = [];

    itemsChart.map((item) => {
      let present = false;
      for (let i = 0; i < updatedItemsChart.length; i++) {
        if (item.id == updatedItemsChart[i].id) {
          updatedItemsChart[i].tookQuantity =
            updatedItemsChart[i].tookQuantity + item.tookQuantity;
          present = true;
          break;
        }
      }
      if (!present) {
        updatedItemsChart.push(item);
      }
    });

    // console.log("UpdatedItemsChart", updatedItemsChart);

    updatedItemsChart.map((item) => {
      let present = false;
      for (let i = 0; i < categoryChart.length; i++) {
        if (item.category == categoryChart[i].category) {
          categoryChart[i].quantity =
            categoryChart[i].quantity + item.tookQuantity;

          present = true;
          break;
        }
      }
      if (!present) {
        categoryChart.push({
          category: item.category,
          quantity: item.tookQuantity,
        });
      }
    });

    // console.log("CategoryChart", categoryChart);

    res.send({
      itemsChart: updatedItemsChart,
      profitChart,
      categoryChart,
      totalExpense,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
