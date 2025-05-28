const generateTrackingNumber = () => {
  return 'IN' + Math.floor(Math.random() * 1000000000);
};

const getEstimatedDeliveryDays = (country) => {
  const shippingDays = {
    US: 5,
    UK: 6,
    AE: 4,
    AU: 8,
    CA: 7
  };
  return shippingDays[country] || 10;
};

const generateShippingLabel = async ({ orderId, userAddress, weight, country }) => {
  return {
    trackingNumber: generateTrackingNumber(),
    courier: 'DHL',
    estimatedDays: getEstimatedDeliveryDays(country),
    shippedFrom: 'Delhi Hub',
    shippedTo: `${userAddress.line1}, ${userAddress.city}, ${country}`,
    weight
  };
};

module.exports = {
  generateShippingLabel
};
