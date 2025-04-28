export const orders = [
    {
        orderId: '123456',
        userId: 'user-101',
        items: [
            { productId: 'prod-1', quantity: 2, price: 500 },
            { productId: 'prod-2', quantity: 1, price: 750 },
        ],
        total: 1750,
        paymentClientSecret: 'secret_abc',
        createdAt: '2025-04-20T12:34:56.789Z',
        status: 'processing',
    },
    {
        orderId: '234567',
        userId: 'user-102',
        items: [{ productId: 'prod-3', quantity: 3, price: 300 }],
        total: 900,
        paymentClientSecret: 'secret_xyz',
        createdAt: '2025-04-22T09:12:33.000Z',
        status: 'delivered',
    },
    {
        orderId: '1234533',
        userId: 'user-105',
        items: [
            { productId: 'prod-1', quantity: 2, price: 500 },
            { productId: 'prod-14', quantity: 2, price: 500 },
            { productId: 'prod-10', quantity: 2, price: 600 },
            { productId: 'prod-2', quantity: 1, price: 750 },
        ],
        total: 4750,
        paymentClientSecret: 'secret_abc',
        createdAt: '2025-04-20T12:34:56.789Z',
        status: 'processing',
    },
]
