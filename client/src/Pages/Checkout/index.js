import TextField from '@mui/material/TextField';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../../App';
import { IoBagCheckOutline } from 'react-icons/io5';
import Button from '@mui/material/Button';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import StripeContainer from '../../Components/StripeContainer';
import { postData } from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const CheckoutForm = () => {

  const [cartData, setCartData] = useState([]);
  const context = useContext(MyContext);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formFields, setFormFields] = useState({
    fullName: "",
    country: "",
    streetAddressLine1: "",
    streetAddressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: ""

  })

  useEffect(() => {
    window.scrollTo(0, 0);
    setCartData(context.cartData);
  }, [context.cartData]);

  const onChangeInput = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value
    }))
  }

  const checkout = async (e) => {
    e.preventDefault();

    if (formFields.fullName === "") {
      context.setAlertBox({ open: true, error: true, msg: "Please fill full name" })
      return false
    }
    if (formFields.country === "") {
      context.setAlertBox({ open: true, error: true, msg: "Please fill country name" })
      return false
    }
    if (formFields.streetAddressLine1 === "") {
      context.setAlertBox({ open: true, error: true, msg: "Please fill street Address" })
      return false
    }
    if (formFields.city === "") {
      context.setAlertBox({ open: true, error: true, msg: "Please fill city name" })
      return false
    }
    if (formFields.state === "") {
      context.setAlertBox({ open: true, error: true, msg: "Please fill state name" })
      return false
    }
    if (formFields.zipCode === "") {
      context.setAlertBox({ open: true, error: true, msg: "Please fill zipcode" })
      return false
    }
    if (formFields.phoneNumber === "") {
      context.setAlertBox({ open: true, error: true, msg: "Please fill phone number" })
      return false
    }
    if (formFields.email === "") {
      context.setAlertBox({ open: true, error: true, msg: "Please fill email" })
      return false
    }

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const totalAmount = (Array.isArray(cartData) && cartData.length > 0) ?
      cartData.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0;

    try {
      // 1. Create Payment Intent
      const response = await postData('/api/orders/create-payment-intent', { amount: totalAmount });

      if (response.error) {
        context.setAlertBox({ open: true, error: true, msg: response.msg || "Payment failed" });
        setIsProcessing(false);
        return;
      }

      const { clientSecret } = response;

      // 2. Confirm Payment
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: formFields.fullName,
            email: formFields.email,
            phone: formFields.phoneNumber,
            address: {
              line1: formFields.streetAddressLine1,
              city: formFields.city,
              state: formFields.state,
              postal_code: formFields.zipCode,
              country: 'PK', // Hardcoded for now, should ideally come from country field
            }
          },
        },
      });

      if (paymentResult.error) {
        context.setAlertBox({ open: true, error: true, msg: paymentResult.error.message });
        setIsProcessing(false);
      } else {
        if (paymentResult.paymentIntent.status === 'succeeded') {
          // 3. Save Order in Database
          const orderData = {
            name: formFields.fullName,
            phoneNumber: formFields.phoneNumber,
            address: formFields.streetAddressLine1 + " " + formFields.streetAddressLine2,
            pincode: formFields.zipCode,
            amount: totalAmount,
            paymentId: paymentResult.paymentIntent.id,
            email: formFields.email,
            userId: context.user.userId,
            products: cartData
          };

          postData('/api/orders/create', orderData).then((res) => {
            context.setAlertBox({
              open: true,
              error: false,
              msg: "Order placed successfully!"
            });

            // Clear Cart (Not implemented yet on backend/frontend, but good to have)
            // context.clearCart(); 

            setIsProcessing(false);
            navigate('/orders');
          })
        }
      }
    } catch (error) {
      context.setAlertBox({ open: true, error: true, msg: error.message });
      setIsProcessing(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <form className='checkoutForm' onSubmit={checkout}>
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">BILLING DETAILS</h2>

              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="Full Name " name='fullName' onChange={onChangeInput} variant="outlined" className='w-100' size="small" />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label="country " variant="outlined" className='w-100' size="small" name='country' onChange={onChangeInput} />
                  </div>
                </div>
              </div>

              <h6>Street Address</h6>
              <div className="row mt-3" >
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label=" House Number and Street Name " variant="outlined" className='w-100' size="small" name='streetAddressLine1' onChange={onChangeInput} />
                  </div>
                  <div className="form-group">
                    <TextField label=" Apartment, suite, unit, etc. " variant="outlined" className='w-100' size="small" name='streetAddressLine2' onChange={onChangeInput} />
                  </div>
                </div>
              </div>


              <h6>Town / City</h6>
              <div className="row mt-3" >
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label=" City " variant="outlined" className='w-100' size="small" name='city' onChange={onChangeInput} />
                  </div>
                </div>
              </div>


              <h6>State / County</h6>
              <div className="row mt-3" >
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label=" State " variant="outlined" className='w-100' size="small" name='state' onChange={onChangeInput} />
                  </div>
                </div>
              </div>


              <h6>Postcode / ZIP</h6>
              <div className="row mt-3" >
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField label=" ZIP CODE " variant="outlined" className='w-100' size="small" name='zipCode' onChange={onChangeInput} />
                  </div>
                </div>
              </div>


              <div className="row mt-3" >
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label=" Phone Number " variant="outlined" className='w-100' size="small" name='phoneNumber' onChange={onChangeInput} />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <TextField label=" Email Address " variant="outlined" className='w-100' size="small" name='email' onChange={onChangeInput} />
                  </div>
                </div>
              </div>

            </div>
            <div className="col-md-4">
              <div className="card orderInfo">
                <h4 className="hd">YOUR ORDER</h4>
                <div className="table-responsive mt-3">
                  <table className="table-border-less">
                    <thead>
                      <tr>
                        <th>Product</th>

                        <th>SubTotal</th>
                      </tr>
                    </thead>
                    <tbody >
                      {
                        (Array.isArray(cartData) && cartData.length > 0) && cartData.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{item?.productTitle?.substr(0, 20) + '...'}<b>x {item?.quantity}</b> </td>

                              <td>Rs {item?.subTotal}</td>
                            </tr>
                          )
                        })
                      }


                      <tr>
                        <td>SubTotal</td>

                        <td>Rs {
                          (Array.isArray(cartData) && cartData.length > 0) ?
                            cartData.map(item => parseInt(item.price) * item.quantity).reduce((total, value) => total + value, 0) : 0
                        }</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3">
                  <h6 className='mb-3 font-weight-bold'>Card Details</h6>
                  <div className='stripe-card-container'>
                    <CardElement options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#424770',
                          '::placeholder': {
                            color: '#aab7c4',
                          },
                        },
                        invalid: {
                          color: '#9e2146',
                        },
                      },
                    }} />
                  </div>
                </div>

                <Button type='submit' disabled={isProcessing} className='btn-blue bg-red btn-lg btn-big w-100 mt-4'>
                  {isProcessing ? "Processing..." : <><IoBagCheckOutline /> &nbsp; Place Order</>}
                </Button>

              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  )
}

const Checkout = () => {
  return (
    <StripeContainer>
      <CheckoutForm />
    </StripeContainer>
  )
}

export default Checkout;
