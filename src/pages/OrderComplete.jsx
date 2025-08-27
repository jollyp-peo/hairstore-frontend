import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "../components/ui/Button";

const OrderComplete = ({ orderData, reference }) => {
	return (
		<div className="min-h-screen bg-background flex items-center justify-center">
			<div className="max-w-md mx-auto text-center p-8">
				<div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
					<CheckCircle className="h-10 w-10 text-green-600" />
				</div>

				<h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
				<p className="text-muted-foreground mb-6">
					Thank you for your purchase. Your order {reference} has been
					confirmed and will be processed within 1-3 business days.
				</p>

				<div className="space-y-3">
					<Button variant="luxury" className="w-full" asChild>
						<Link to="/products">Continue Shopping</Link>
					</Button>
					<Button variant="outline" className="w-full">
						Track Your Order
					</Button>
				</div>

				<div className="mt-8 p-4 bg-card rounded-lg border">
					<h3 className="font-semibold mb-2">Order Summary</h3>
					<div className="text-sm space-y-1">
						<div className="flex justify-between">
							<span>Order Number:</span>
							<span className="font-medium">{reference}</span>
						</div>
						<div className="flex justify-between">
							<span>Total:</span>
							<span className="font-medium text-primary">
								{orderData?.total?.toLocaleString("en-NG", {
									style: "currency",
									currency: "NGN",
								})}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderComplete;