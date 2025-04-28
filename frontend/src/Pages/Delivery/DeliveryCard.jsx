import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  CardActionArea,
  Divider
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PersonIcon from '@mui/icons-material/Person';

const getStatusColor = (status) => {
  switch (status) {
    case 'ASSIGNED':
      return '#f9a825'; // amber
    case 'PICKED_UP':
      return '#1976d2'; // blue
    case 'DELIVERED':
      return '#2e7d32'; // green
    default:
      return '#757575'; // grey
  }
};

const DeliveryCard = ({ delivery }) => {
  return (
    <Card elevation={2}>
      <CardActionArea component={Link} to={`/delivery/${delivery._id}`}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" component="h2">
              Order #{delivery.orderID}
            </Typography>
            <Chip
              label={delivery.status}
              style={{
                backgroundColor: getStatusColor(delivery.status),
                color: 'white'
              }}
            />
          </Box>
          
          <Box display="flex" alignItems="center" mb={1}>
            <StorefrontIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {delivery.shopname}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" mb={1}>
            <PersonIcon color="secondary" sx={{ mr: 1 }} />
            <Typography variant="body1">
              {delivery.customername}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5 }} />
          
          <Box display="flex" alignItems="center">
            <LocalShippingIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="textSecondary">
              Driver: {delivery.driverName || 'Not assigned'}
            </Typography>
          </Box>
          
          {delivery.distanceToShop && (
            <Typography variant="caption" color="textSecondary" display="block" mt={1}>
              Distance: {delivery.distanceToShop} km
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default DeliveryCard;