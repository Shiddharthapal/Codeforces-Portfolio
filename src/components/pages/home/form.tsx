import React, { useState } from "react";

// Mock UI components to simulate shadcn/ui look and feel
const DialogContent = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 border border-gray-200">
    {children}
  </div>
);

const DialogHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-4 pb-4 border-b border-gray-200">{children}</div>
);

const DialogTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg font-semibold text-gray-900">{children}</h2>
);

const Label = ({
  htmlFor,
  className,
  children,
}: {
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium text-gray-700 ${className}`}
  >
    {children}
  </label>
);

const Input = ({
  id,
  value,
  onChange,
  className,
  type = "text",
}: {
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  className?: string;
  type?: string;
}) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
  />
);

const Button = ({
  onClick,
  children,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
  >
    {children}
  </button>
);
const CloseButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => (
  <button
    onClick={onClick}
    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
    aria-label="Close"
  ></button>
);

// The actual form component
export default function accountForm() {
  const [newContestant, setNewContestant] = useState({
    name: "",
    department: "",
    semester: "",
    vjudgeHandle: "",
    cfHandle: "",
    clistHandle: "",
    cfRound913: "",
    atcoderBeginner: "",
    cf3: "",
  });

  const handleAddContestant = () => {
    alert("Contestant would be added here!");
  };
  const handleClose = () => {
    alert("Form would close here!");
  };

  // Helper function to create form fields
  const renderField = (
    id: keyof typeof newContestant,
    label: any,
    type = "text"
  ) => (
    <div className="grid grid-cols-4 items-center gap-4 mb-2">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={newContestant[id] || ""}
        onChange={(e) =>
          setNewContestant({
            ...newContestant,
            [id]: e.target.value,
          })
        }
        className="col-span-3 h-8"
      />
    </div>
  );

  return (
    <div className="flex justify-center items-center">
      <DialogContent>
        <CloseButton onClick={handleClose} />
        <DialogHeader>
          <DialogTitle>Add New Contestant</DialogTitle>
        </DialogHeader>
        <div className="">
          {renderField("name", "Name")}
          {renderField("department", "Department")}
          {renderField("semester", "Semester")}
          {renderField("vjudgeHandle", "Vjudge Handle")}
          {renderField("cfHandle", "CF Handle")}
          {renderField("clistHandle", "Clist Handle")}
          {renderField("cfRound913", "CF Round 913")}
          {renderField("atcoderBeginner", "Atcoder Beginner")}
          {renderField("cf3", "CF 3")}
        </div>
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button onClick={handleAddContestant}>Add Contestant</Button>
        </div>
      </DialogContent>
    </div>
  );
}
