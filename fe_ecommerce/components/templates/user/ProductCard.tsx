// src/components/ProductCard.tsx
import {Badge, Button, Card} from 'antd';
import {ShoppingCartOutlined} from '@ant-design/icons';

const ProductCard = ({ product }: { product: any }) => (
    <Card
        hoverable
        className="transition-all duration-300 hover:shadow-xl rounded-lg"
        cover={<img src={product.image} alt={product.name} className="p-4" />}
    >
        <Badge.Ribbon text="Trả góp 0%" color="red">
            <h3 className="font-bold text-md mt-2">{product.name}</h3>
        </Badge.Ribbon>
        <p className="text-red-600 font-extrabold text-lg mt-2">
            {product.price.toLocaleString()}đ
        </p>
        <Button type="primary" block icon={<ShoppingCartOutlined />}>
            Thêm vào giỏ
        </Button>
    </Card>
);