import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

/* TYPES */
// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
// }

// interface Order {
//   id: string;
//   date: string;
//   status?: string;
//   customer: { name: string; email: string };
//   address: {
//     name: string;
//     phone: string;
//     street: string;
//     city: string;
//     zip: string;
//     country: string;
//   };
//   products: Product[];
// }

/* FONT */
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf",
    },
    {
      src: "https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmWUlfBBc9.ttf",
      fontWeight: "bold",
    },
  ],
});

/* STYLES */
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#fff",
    padding: 30,
    fontSize: 11,
    fontFamily: "Roboto",
    color: "#111",
  },

  pageBorder: {
    position: "absolute",
    top: 10,
    left: 10,
    right: 10,
    bottom: 10,
    border: "2 solid #111",
    borderRadius: 10,
  },

  header: {
    marginBottom: 20,
    borderBottom: "2 solid #111",
    paddingBottom: 12,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },

  shop: {
    fontSize: 10,
    color: "#555",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  card: {
    border: "1 solid #e5e5e5",
    borderRadius: 10,
    padding: 12,
    width: "48%",
    backgroundColor: "#fafafa",
  },

  fullCard: {
    border: "1 solid #e5e5e5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#fafafa",
  },

  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
    borderBottom: "1 solid #ddd",
    paddingBottom: 4,
  },

  text: {
    marginBottom: 3,
  },

  table: {
    border: "1 solid #ddd",
    borderRadius: 8,
    overflow: "hidden",
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#111",
    color: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 6,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderBottom: "1 solid #eee",
  },

  col1: { width: "45%" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "20%", textAlign: "right" },
  col4: { width: "20%", textAlign: "right" },

  totalRow: {
    flexDirection: "row",
    borderTop: "1 solid #bbb",
    padding: 10,
    backgroundColor: "#f3f4f6",
  },

  totalLabel: {
    width: "60%",
    fontWeight: "bold",
    fontSize: 12,
  },

  totalValue: {
    width: "40%",
    textAlign: "right",
    fontWeight: "bold",
    fontSize: 12,
  },

  /* 🔥 WATERMARK (now separate section) */
  watermarkContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
    marginVertical: 40,
  },

  watermark: {
    fontSize: 70,
    fontWeight: "bold",
    color: "#000",
    opacity: 0.08,
    transform: "rotate(-25deg)",
  },

  /* FOOTER */
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 10,
    color: "#666",
    borderTop: "1 solid #999",
    paddingTop: 6,
  },
});

/* COMPONENT */
const InvoicePDF = ({ order }: { order: any }) => {
  const watermarkTop = order.orderStatus === "Cancelled" ? "20%" : "26%";

  const watermarkText =
    order.orderStatus === "Cancelled" ? "CANCELLED" : "PAID";

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* 🔥 PAGE BORDER */}
        <View style={styles.pageBorder} fixed />

        {/* HEADER */}

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
          <Text style={styles.shop}>
            {order.sellerId.businessDetails.bussinessName}
          </Text>
          {/* <Text style={styles.shop}>Kochi, Kerala, India{order.sellerId.businessDetails.bussinessName},{order.sellerId.businessDetails.bussinessName},{order.sellerId.businessDetails.bussinessName}</Text> */}
          <Text style={styles.shop}>
            Phone: {order.sellerId.businessDetails.bussinessPhone}
          </Text>
          <Text style={styles.shop}>
            {order.sellerId.businessDetails.businessEmail}
          </Text>
        </View>

        {/* CUSTOMER + ORDER */}
        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Customer</Text>
            <Text style={styles.text}>{order.userId.name}</Text>
            <Text style={styles.text}>{order.userId.email}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order</Text>
            <Text style={styles.text}>ID: {order.orderId}</Text>
            <Text style={styles.text}>
              Date:{" "}
              {new Date(order.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
        </View>

        {/* SHIPPING */}
        <View style={styles.fullCard}>
          <Text style={styles.cardTitle}>Shipping Address</Text>
          <Text style={styles.text}>{order.shippingAddress.name}</Text>

          <Text style={styles.text}>{order.shippingAddress.email}</Text>

          <Text style={styles.text}>{order.shippingAddress.phone}</Text>

          <Text style={styles.text}>
            {order.shippingAddress.flatNoOrVillaNo}
          </Text>

          <Text style={styles.text}>{order.shippingAddress.street}</Text>

          <Text style={styles.text}>{order.shippingAddress.area}</Text>

          <Text style={styles.text}>{order.shippingAddress.landmark}</Text>

          <Text style={styles.text}>
            {order.shippingAddress.city}, {order.shippingAddress.postalCode}
          </Text>

          <Text style={styles.text}>{order.shippingAddress.emirate}</Text>

          <Text style={styles.text}>
            Additional Note:{" "}
            {order.additionalNotes || "No additional note provided"}
          </Text>
        </View>

        {/* PRODUCTS */}
        <View style={styles.fullCard}>
          <Text style={styles.cardTitle}>Products</Text>

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Product</Text>
              <Text style={styles.col2}>Qty</Text>
              <Text style={styles.col3}>Price</Text>
              <Text style={styles.col4}>Total</Text>
            </View>

            {order.orderItems.map((p: any) => (
              <View style={styles.tableRow} key={p._id}>
                <Text style={styles.col1}>{p.product.name}</Text>
                <Text style={styles.col2}>{p.quantity}</Text>
                <Text style={styles.col3}>{Number(p.perItem).toFixed(0)}</Text>
                <Text style={styles.col4}>
                  {p.totalSellingPrice.toFixed(0)}
                </Text>
              </View>
            ))}

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>
                {Number(order.totalSellingPrice).toFixed(0)}
              </Text>
            </View>
          </View>
        </View>

        {/* 🔥 WATERMARK BETWEEN CONTENT */}
        <View style={[styles.watermarkContainer, { top: watermarkTop }]}>
          <Text style={styles.watermark}>{watermarkText}</Text>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text>
            Thank you for shopping with{" "}
            {order.sellerId.businessDetails.bussinessName}
          </Text>
          <Text>We appreciate your business!</Text>
        </View>
      </Page>
    </Document>
  );
};

export default InvoicePDF;
