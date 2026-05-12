import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chip from "@mui/material/Chip";
import { emphasize, styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { editData, fetchDataFromApi } from "../../utils/api";
import { useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import Pagination from '@mui/material/Pagination';
import { MyContext } from "../../App";


const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(3),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &: focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        }
    };
});


const Orders = () => {

    const [orders, setOrders] = useState([]);
    const context = useContext(MyContext);
    const [page, setPage] = useState(1);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (context.user.userId !== "") {
            fetchDataFromApi(`/api/orders?userId=${context.user.userId}`).then((res) => {
                setOrders(res);
            });
        }
    }, [context.user.userId]);

    const handleStatusChange = (orderId, newStatus) => {
        editData(`/api/orders/${orderId}`, { status: newStatus }).then((res) => {
            if (res) {
                // Update local state to reflect the change
                setOrders(prevOrders => prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                ));
                context.setAlertBox({
                    open: true,
                    error: false,
                    msg: "Order status updated successfully!"
                });
            }
        });
    }

    const handleChange = (event, value) => {
        setPage(value)
        fetchDataFromApi(`/api/orders?page=${value}&perpage=8`).then((res) => {
            setOrders(res);
            window.scrollTo({
                top: 200,
                behavior: "smooth",
            })
        })
    }

    return (
        <>


            <div className="right-content w-100">
                <div className="card shadow border-0 w-100 flex-row p-4 align-items-center">
                    <h5 className="mb-0">Orders List</h5>
                    <div className="ml-auto d-flex align-items-center">
                        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
                            <StyledBreadcrumb
                                component="a"
                                href="/"
                                label="Dashboard"
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb
                                label="Orders"
                                deleteIcon={<ExpandMoreIcon />}
                            />
                        </Breadcrumbs>

                    </div>

                </div>

                <div className="card shadow border-0 p-3 mt-4">
                    <div className="table-responsive mt-3">
                        <table className="table table-bordered v-align">
                            <thead className="thead-dark">
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
                                                    <select
                                                        className={`form-control ${order?.status === "pending" ? "text-danger" : "text-success"}`}
                                                        value={order?.status}
                                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                    </select>
                                                </td>
                                                <td>{order?.date?.split('T')[0]}</td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        {
                            orders?.orderList > 1 && <div className="d-flex tableFooter">
                                <Pagination count={orders?.orderList || 1} color="primary" className="pagination" showFirstButton showLastButton onChange={handleChange} />
                            </div>
                        }
                    </div>

                </div>

            </div>
        </>
    )
}

export default Orders
