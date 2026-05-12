import React, { useContext, useEffect, useState } from 'react';
import { fetchDataFromApi } from '../../utils/api';
import { MyContext } from '../../App';


const Orders = () => {
  const [orders, setOrders] = useState([]);
  const context = useContext(MyContext);
 


  useEffect(() => {
    window.scrollTo(0, 0);
    if (context.user.userId !== "") {
      fetchDataFromApi(`/api/orders?userId=${context.user.userId}`).then((res) => {
        setOrders(res);
      });
    }
  }, [context.user.userId]);

  return (
    <>
      <section className="section">
        <div className="container">
          <h3 className="hd mb-4">Orders</h3>
          <div className="table-responsive">
            <table className='table orders-table' >
              <thead>
                <tr>
                  <th>Payment ID</th>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Pincode</th>
                  <th>Total</th>
                  <th>Email</th>
                  <th>Order Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  Array.isArray(orders) && orders?.length !== 0 && orders?.map((order, index) => {
                    return (
                      <tr key={index}>
                        <td><span className='text-blue font-weight-bold'>{order?.paymentId}</span></td>
                        <td>{order?.name}</td>
                        <td>{order?.phoneNumber}</td>
                        <td>{order?.address}</td>
                        <td>{order?.pincode}</td>
                        <td>Rs {order?.amount}</td>
                        <td>{order?.email}</td>
                        <td>
                          <span className={`badge ${order?.status === "pending" ? "badge-danger" : "badge-success"}`}>
                            {order?.status}
                          </span>
                        </td>
                        <td>{order?.date?.split('T')[0]}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  )
}

export default Orders;
