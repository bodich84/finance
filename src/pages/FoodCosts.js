import { useEffect, useState } from 'react';
import { Table } from 'antd';

const API_TOKEN = '433607:80265139b087d9e83b4f4952f4d416cc';

const FoodCosts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.joinposter.com/menu.getMenu?token=${API_TOKEN}`);
        const json = await res.json();
        const items = json.response?.menu || json.response || [];
        const products = Array.isArray(items)
          ? items.flatMap((item) => item.products || item)
          : [];
        const tableData = products.map((prod) => ({
          key: prod.product_id,
          name: prod.product_name,
          primeCost: prod.primeCost,
        }));
        setData(tableData);
      } catch (e) {
        console.error('Failed to fetch food costs', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    { title: 'Фудкост', dataIndex: 'primeCost', key: 'primeCost' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Фудкост страв</h2>
      <Table columns={columns} dataSource={data} loading={loading} rowKey="key" />
    </div>
  );
};

export default FoodCosts;
