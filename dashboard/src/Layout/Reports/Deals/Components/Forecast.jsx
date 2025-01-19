import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx"; // Install using `npm install xlsx`
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Adjust the import to your Shadcn setup
import api from "@/utils/api";
import { Button } from "@/components/ui/button";

function Forecast() {
  const { currentUser } = useSelector((state) => state.auth);
  const [result, setResult] = useState({ won: [], open: [] });
  const [totalAmount, setTotalAmount] = useState({ won: 0, open: 0 });

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      const fetchforecast = await api.get("/reports/forecast");
      const res = await fetchforecast.data;

      const wonTotal = res.data.won.reduce((sum, project) => sum + project.amount, 0);
      const openTotal = res.data.open.reduce((sum, project) => sum + project.amount, 0);

      setResult(res.data);
      setTotalAmount({ won: wonTotal, open: openTotal });
    };

    fetchProjects();
  }, []);

  // Handle download as Excel
  const handleDownload = (data, fileName, total) => {
    // Remove the `trainingDates` field
    const processedData = data.map(({ trainingDates, ...rest }) => rest);

    // Add the total amount row
    processedData.push({
      trainingName: "Total Amount",
      companyName: "",
      amount: total,
    });
    

    const worksheet = XLSX.utils.json_to_sheet(processedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <div>
      <div className="mt-5 border-t pt-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-lg">Forecast</div>
        </div>

        {/* Won Projects Table */}
        <div className="mt-5">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-md">Won Projects</h2>
            <Button
              // className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => handleDownload(result.won, "Won_Projects", totalAmount.won)}
            >
              Download Won Projects
            </Button>
          </div>
          <Table className="mt-3">
            <TableHeader>
              <TableRow>
                <TableHead>S.no</TableHead>
                <TableHead>Training Name</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.won.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.trainingName}</TableCell>
                  <TableCell>{item.companyName}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
              {/* Total Amount Row */}
              <TableRow  className="font-semibold">
                <TableCell className="font-semibold">
                  Total Amount
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>{totalAmount.won}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Open Projects Table */}
        <div className="mt-10">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-md">Open Projects</h2>
            <Button
              // className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => handleDownload(result.open, "Open_Projects", totalAmount.open)}
            >
              Download Open Projects
            </Button>
          </div>
          <Table className="mt-3">
            <TableHeader>
              <TableRow>
                <TableHead>S.no</TableHead>
                <TableHead>Training Name</TableHead>
                <TableHead>Company Name</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.open.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.trainingName}</TableCell>
                  <TableCell>{item.companyName}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                </TableRow>
              ))}
              {/* Total Amount Row */}
              <TableRow  className="font-semibold">
                <TableCell>
                  Total Amount
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>{totalAmount.open}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default Forecast;
