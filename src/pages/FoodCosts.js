import { useEffect, useState } from 'react';
import { Table } from 'antd';

const FoodCosts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/poster/menu');
        const products = await res.json();
        const tableData = Array.isArray(products)
          ? products.map((prod, index) => ({
              key: prod.name || index,
              name: prod.name,
              primeCost: prod.prime_cost,
            }))
          : [];
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
