import React, { useEffect, useState } from "react";
import axios from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { useToast } from "@/hooks/use-toast";

const expenseOptions = ["Trainer", "Venue", "Travel", "Boarding_Lodging", "cw_lab", "miscellaneous"];

const ExpenseCard = ({ type, onUpdate }) => {
  return (
    <div className="border p-4 rounded-md mb-4">
      <h3 className="font-semibold mb-2">{type.category.split("_").join(" ")} Expense</h3>
      <div className="flex items-center justify-between mt-3">
        <Label className="flex items-center">
          Amount:
          <Input
            type="number"
            value={type.amount || ""}
            onChange={(e) => onUpdate(type.category, "amount", Number(e.target.value))}
            className="ml-2 border rounded p-1"
          />
        </Label>

        <Label className="flex items-center">
          Due Date:
          <Input
            type="date"
            value={type.dueDate ? type.dueDate.split("T")[0] : ""}
            onChange={(e) => onUpdate(type.category, "dueDate", e.target.value)}
            className="ml-2 border rounded p-1"
          />
        </Label>

        <Label className="flex items-center">
          Is Paid:
          <input
            type="checkbox"
            checked={type.isPaid || false}
            onChange={(e) => onUpdate(type.category, "isPaid", e.target.checked)}
            className="ml-2"
          />
        </Label>
      </div>
    </div>
  );
};

function Expense({ expensesList }) {
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [expenses, setExpenses] = useState({});

  const queryClient = useQueryClient();
  const params = useParams();
  const { toast } = useToast();

  // Initial transformation of expensesList
  useEffect(() => {
    const transformedArray = Object.entries(expensesList).map(([key, value]) => ( {
      category: key,
      ...value,
    }));
    setSelectedExpenses(transformedArray);
    setExpenses(expensesList);
  }, [expensesList, params.projectId]);

  // Handle dropdown selection for adding new expense types
  const handleDropdownSelect = (value) => {
    if (!expenses[value]) {
      const newExpense = {
        amount: 0,
        dueDate: "",
        isPaid: false,
      };

      setExpenses({
        ...expenses,
        [value]: newExpense,
      });

      setSelectedExpenses([...selectedExpenses, { category: value, ...newExpense }]);
    }
  };

  // Update individual expense fields
  const handleUpdateExpense = (category, field, value) => {
    const updatedExpenses = {
      ...expenses,
      [category]: {
        ...expenses[category],
        [field]: value,
      },
    };

    setExpenses(updatedExpenses);

    const updatedSelectedExpenses = selectedExpenses.map((expense) =>
      expense.category === category ? { ...expense, [field]: value } : expense
    );

    setSelectedExpenses(updatedSelectedExpenses);
  };

  // Save or update expenses in the backend
  const saveExpenses = async () => {
    try {
      const response = await axios.put(
        `http://bas.rjpinfotek.com:5000/api/project/expense/${params.projectId}`,
        expenses // Send updated `expenses` object
      );
      const result = await response.data;
      queryClient.invalidateQueries(["ViewProject", params.projectId]);
      toast({ title: "Expenses saved successfully", variant: "success" });
    //   alert("Expenses saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save expenses.");
    }
  };

  return (
    <div className="border border-gray-300 rounded-md my-5 px-3 py-2">
      <div className="font-semibold">Expenses</div>

      <div className="my-4">
        <Select onValueChange={(e) => handleDropdownSelect(e)}>
          <SelectTrigger className="w-max">
            <SelectValue placeholder="Select Expense Type" />
          </SelectTrigger>
          <SelectContent>
            {expenseOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option.split("_").join(" ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        {selectedExpenses.map((expenseType) => (
          <ExpenseCard key={expenseType.category} type={expenseType} onUpdate={handleUpdateExpense} />
        ))}

        <Button onClick={saveExpenses} className="bg-black text-white rounded-none px-4 py-2 mt-4">
          Save Expenses
        </Button>
      </div>
    </div>
  );
}

export default Expense;
