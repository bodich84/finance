import { Select } from 'antd';
import { useAccounts } from '../../context/AccountsContext';

const { Option } = Select;

const AccountSelect = ({ value, onChange }) => {
  const { accounts } = useAccounts();
  return (
    <Select
      showSearch
      placeholder='Оберіть рахунок'
      value={value}
      onChange={onChange}
      filterOption={(input, option) =>
        option?.children?.toString().toLowerCase().includes(input.toLowerCase())
      }
    >
      {accounts.map((acc) => (
        <Option key={acc.id} value={acc.name}>
          {acc.name}
        </Option>
      ))}
    </Select>
  );
};

export default AccountSelect;

