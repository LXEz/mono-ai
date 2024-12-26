import { Input } from "@/components/ui/input";
import clsx from "clsx";
import React, { useState } from "react";
import * as XLSX from "xlsx";

// call back function to let parent component to use the data
interface UploadExcelProps {
  showTitle?: boolean;
  showTable?: boolean;
  className?: string;
  disable?: boolean;
  onDataExtracted: (data: any[]) => void;
}

const UploadExcel: React.FC<UploadExcelProps> = ({
  showTitle = false,
  showTable = false,
  className,
  disable = false,
  onDataExtracted,
}) => {
  const [excelData, setExcelData] = useState<any[]>([]);
  const fileType: string = ".xlsx, .xls, .xlsb";

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const data = event.target?.result;
      if (!data) return;

      const workbook = XLSX.read(data, { type: "binary" });

      // only first sheet
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // to json
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setExcelData(jsonData);
      onDataExtracted(jsonData);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div>
      {showTitle && (
        <h2 className="text-xl font-bold mb-4">Upload and Read Excel</h2>
      )}

      <Input
        type="file"
        accept={fileType}
        onChange={handleFileUpload}
        className={clsx(className, "mb-4")}
        disabled={disable}
      />
      {showTable && excelData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Excel Data:</h3>
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                {Object.keys(excelData[0]).map((key) => (
                  <th key={key} className="border border-gray-300 px-4 py-2">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {excelData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((cell, cellIndex) => (
                    //<td
                    //  key={cellIndex}
                    //  className="border border-gray-300 px-4 py-2"
                    //>
                    //  {cell}
                    //</td>
                    <td
                      key={cellIndex}
                      className="border border-gray-300 px-4 py-2"
                    >
                      {typeof cell === "object"
                        ? JSON.stringify(cell)
                        : cell?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UploadExcel;
