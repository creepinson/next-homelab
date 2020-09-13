import { withRouter } from "next/router";
import React from "react";
import { Alert, Table } from "react-bootstrap";
import { PricingData } from "../../lib/types";

class PricingResult extends React.Component<any, any> {
    // this.props.router.query.name
    render() {
        const budget = this.props.router.query.budget;
        let pricing: PricingData[] = this.props.router.query.pricing;
        if (budget) pricing = pricing.filter((p) => p.price <= budget);
        if (!pricing)
            return <Alert variant="danger">Invalid Pricing Request.</Alert>;
        else
            return (
                <Table id="pricing">
                    <thead>
                        <tr>
                            <th>Plan</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pricing.map((p) => (
                            <tr>
                                <td>{p.plan}</td>
                                <td>
                                    {p.unit}
                                    {p.price}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            );
    }
}

export default withRouter(PricingResult);
