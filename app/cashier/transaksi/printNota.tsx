import { IOrder } from "@/app/types";
import { dateFormat, priceFormat } from "@/lib/format";

export const printNota = (order: IOrder) => {
    const newWindow = window.open("", "_blank");
    if (newWindow) {
        newWindow.document.write(`
            <html>
                <head>
                    <title>Nota</title>
                    <style>
                        @media print {
                            @page {
                                size: 58mm auto;
                                margin: 0;
                            }
                            body {
                                margin: 0;
                                font-family: 'Courier New', Courier, monospace;
                                font-size: 12px;
                                width: 58mm;
                            }
                        }
                        body {
                            font-family: 'Courier New', Courier, monospace;
                            font-size: 12px;
                            margin: 0;
                            padding: 10px;
                        }
                        .nota {
                            width: 58mm; /* standard thermal printer width */
                            padding: 5px;
                        }
                        .header, .footer {
                            text-align: center;
                            margin-bottom: 10px;
                        }
                        .content {
                            margin-bottom: 10px;
                        }
                        .line {
                            border-top: 1px dashed #000;
                            margin: 5px 0;
                        }
                        .items td {
                            padding: 2px 0;
                        }
                        .totals td {
                            padding-top: 5px;
                        }
                        .totals .label {
                            text-align: left;
                        }
                        .totals .value {
                            text-align: right;
                            font-weight: bold;
                        }
                        .detail {
                            margin-top: 0;
                            margin-bottom: 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="nota">
                        <div class="header">
                            <p><strong>Fooder</strong></p>
                            <p>SMK Telkom Malang</p>
                        </div>
                        <div class="content">
                            <p class="detail">Order ID: #${order.id}</p>
                            <p class="detail">Date: ${dateFormat(order.createdAt)}</p>
                            <p class="detail">Customer: ${order.customer}</p>
                            <div class="line"></div>
                            <table class="items" width="100%">
                                ${order.orderLists
                                    ?.map(
                                        (item) => `
                                    <tr>
                                        <td>${item.Menu.name}</td>
                                        <td align="right">${item.quantity} x</td>
                                        <td align="right">${priceFormat(item.Menu.price)}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="3" align="right">${priceFormat(item.quantity * item.Menu.price)}</td>
                                    </tr>
                                `
                                    )
                                    .join("")}
                            </table>
                            <div class="line"></div>
                            <table class="totals" width="100%">
                                <tr>
                                    <td class="label">Total:</td>
                                    <td class="value">${priceFormat(order.total_price)}</td>
                                </tr>
                                <tr>
                                    <td class="label">Payment:</td>
                                    <td class="value">${order.payment_method}</td>
                                </tr>
                            </table>
                        </div>
                        <div class="footer">
                            <p>Thank you!</p>
                            <p>Hope you enjoy your meal</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        newWindow.document.close();
        newWindow.onload = () => {
            newWindow.print();
            newWindow.close();
        };
    }
};