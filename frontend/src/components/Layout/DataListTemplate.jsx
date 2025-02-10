import { DataList } from "@radix-ui/themes";

const DataListTemplate = ({ children, list, ...props }) => {
  return (
    <DataList.Root orientation="vertical" size="3" {...props}>
      {list.map((item, index) => (
        <DataList.Item key={item.id || index}>
          <DataList.Value>
            <span
              style={{
                marginRight: "3%",
                marginLeft: "2%",
                alignContent: "center",
                fontSize: "150%",
              }}
            >
              •
            </span>
            {typeof children === "function" ? children(item) : children}
          </DataList.Value>
        </DataList.Item>
      ))}
    </DataList.Root>
  );
};

export default DataListTemplate;
