import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Subject {
  id: string;
  name: string;
}

interface SubjectTabsProps {
  subjects: Subject[];
  currentSubject: string;
  onChange: (subject: string) => void;
}

const SubjectTabs = ({ subjects, currentSubject, onChange }: SubjectTabsProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <Tabs 
        defaultValue={currentSubject} 
        onValueChange={onChange}
        className="w-full"
      >
        <TabsList className="mb-4 overflow-x-auto flex flex-nowrap p-1 w-full bg-secondary/20 rounded-lg">
          {subjects.map((subject) => (
            <TabsTrigger 
              key={subject.id}
              value={subject.id}
              className="whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-fuchsia-500 data-[state=active]:text-white rounded-md transition-all duration-300"
            >
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default SubjectTabs;