import React, {useState, useEffect} from 'react'
import api from './api'

function App() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: ''
  });
  const [refresh, setRefresh] = useState(false)

  const fetchTransactions = async () => {
    const response = await api.get('/transactions')
    setTransactions(response.data)
  };

  const clearTransactions = async () => { 
    await api.delete('/clear-db');
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    fetchTransactions();
  }, [refresh]);

  const handleInputChange = (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormData({
      ...formData,
      [event.target.name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await api.post('/transactions/', formData);
    fetchTransactions();
    setFormData(
      {
      amount: '',
      category: '',
      description: '',
      is_income: false,
      date: ''
    }
   );
  }

  return (
    <div class="App">
      <nav className="h-[64px] w-full bg-gray-800 flex items-center px-20">
        <div className=''>
          <a className='text-white font-semibold text-2xl' href='/'>
            App
          </a>
        </div>
      </nav>

      <div className='px-20 py-5'>
        <form onSubmit={handleFormSubmit}>
          <div className='flex flex-col space-y-2 my-3'>
            <label htmlFor='amount' className='font-medium text-xl'>
              Amount
            </label>
            <input id='amount' name='amount' type='text' className='border border-gray-400 bg-slate-50 rounded-sm h-[36px]' onChange={handleInputChange} value={formData.amount}/>
          </div>

          <div className='flex flex-col space-y-2 my-3'>
            <label htmlFor='category' className='font-medium text-xl'>
              Category
            </label>
            <input id='category' name='category' type='text' className='border border-gray-400 bg-slate-50 rounded-sm h-[36px]' onChange={handleInputChange} value={formData.category}/>
          </div>

          <div className='flex flex-col space-y-2 my-3'>
            <label htmlFor='description' className='font-medium text-xl'>
              Description
            </label>
            <input id='description' name='description' type='text' className='border border-gray-400 bg-slate-50 rounded-sm h-[36px]' onChange={handleInputChange} value={formData.description}/>
          </div>

          <div className='flex flex-row items-center space-x-2 my-3'>
            <label htmlFor='is_income' className='font-medium text-xl'>
              Has Income?
            </label>
            <input id='is_income' name='is_income' type='checkbox' onChange={handleInputChange} value={formData.is_income}/>
          </div>

          <div className='flex flex-col space-y-2 my-3'>
            <label htmlFor='date' className='font-medium text-xl'>
              Date
            </label>
            <input id='date' name='date' type='text' className='border border-gray-400 bg-slate-50 rounded-sm h-[36px]' onChange={handleInputChange} value={formData.date}/>
          </div>

          <div className='flex justify-center py-5'>
            <button type='submit' className='bg-blue-600 text-white h-[45px] w-[164px] rounded-md text-xl transform transition-transform duration-100 hover:scale-105'>Submit</button>
          </div>
        </form>
      </div>
      <div className='py-5'>
          <div className='font-semibold text-2xl px-20'>Transactions</div>
          <div className='px-20'>
            <table className="table-auto w-full bg-white shadow-lg rounded-lg">
              <thead className="bg-slate-800 text-white">
                <tr>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Description</th>
                  <th className="px-4 py-2">Has Income</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-center">{transaction.amount}</td>
                    <td className="px-4 py-2">{transaction.category}</td>
                    <td className="px-4 py-2">{transaction.description}</td>
                    <td className="px-4 py-2">{transaction.is_income ? 'Yes' : 'No'}</td>
                    <td className="px-4 py-2">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>

      <div className='flex justify-center py-5'>
        <button onClick={clearTransactions} type='submit' className='bg-red-600 text-white h-[45px] w-[164px] rounded-md text-xl transform transition-transform duration-100 hover:scale-105'>Clear</button>
      </div>
    </div>
  );
}

export default App;
