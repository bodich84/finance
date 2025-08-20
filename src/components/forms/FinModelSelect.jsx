import { Select } from 'antd';
import { useFinModels } from '../../context/FinModelsContext';

const { Option } = Select;

const FinModelSelect = ({ value, onChange }) => {
  const { finmodels } = useFinModels();
  return (
    <Select
      showSearch
      placeholder='Оберіть фінмодель'
      value={value}
      onChange={onChange}
      filterOption={(input, option) =>
        option?.children?.toString().toLowerCase().includes(input.toLowerCase())
      }
    >
      {finmodels.map((fm) => (
        <Option key={fm.id} value={fm.name}>
          {fm.name}
        </Option>
      ))}
    </Select>
  );
};

export default FinModelSelect;

