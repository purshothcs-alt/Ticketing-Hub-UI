import { useEffect, useState } from "react";
import { Box, Paper, Typography, Tabs, Tab } from "@mui/material";
import { CategoryManagement } from "./CategoryManagement";
import { SubcategoryManagement } from "./SubcategoryManagement";
import { PriorityManagement } from "./PriorityManagement";
import { StatusManagement } from "./StatusManagement";
import { ModuleManagement } from "./ModuleManagement";
import { canView } from "../../../shared/utils/helper";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);
const configTabs = [
  { label: "Categories", component: <CategoryManagement />, moduleName: "Categories" },
  { label: "Subcategories", component: <SubcategoryManagement />, moduleName: "SubCategories" },
  { label: "Priorities", component: <PriorityManagement />, moduleName: "Priorities" },
  { label: "Statuses", component: <StatusManagement />, moduleName: "Status" },
  { label: "Modules", component: <ModuleManagement />, moduleName: "Modules" },
];



export const ConfigurationPage = () => {
const visibleTabs = configTabs.filter(tab => canView(tab.moduleName) ?? false);
const [currentTab, setCurrentTab] = useState(0);

useEffect(() => {
  if (visibleTabs.length > 0 && currentTab >= visibleTabs.length) {
    setCurrentTab(0);
  }
}, [visibleTabs]);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Configuration Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage categories, priorities, statuses, and SLA settings
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            "& .MuiTab-root": {
              textTransform: "none",
              minWidth: 120,
              fontWeight: 500,
            },
          }}
        >
          {visibleTabs.map((tab, index) => (
    <Tab key={index} label={tab.label} />
  ))}
        </Tabs>
      </Paper>

  

      {visibleTabs.map((tab, index) => (
  <TabPanel key={index} value={currentTab} index={index}>
    {tab.component}
  </TabPanel>
))}
    </Box>
  );
};
