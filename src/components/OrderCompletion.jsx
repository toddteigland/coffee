import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from "../styles/orderCompletion.module.css"
import { useSocket } from "../components/SocketContext";

const ItemType = {
  ORDER: 'ORDER',
};

const DraggableOrder = ({ order }) => {
  const [, ref] = useDrag(() => ({
    type: ItemType.ORDER,
    item: order,
  }));

  return (
    <div ref={ref}>
      {/* You can modify this layout */}
      {order.id} - {order.username}
    </div>
  );
};

const DroppableOrderContainer = ({ orders, setOrders }) => {
  const [, ref] = useDrop(() => ({
    accept: ItemType.ORDER,
    drop: (item) => setOrders((prevOrders) => [...prevOrders, item]),
  }));

  return (
    <div ref={ref}>
      {orders.map((order, index) => (
        <DraggableOrder order={order} key={index} />
      ))}
    </div>
  );
};

export default function OrderCompletion({ storeId, isStoreLoggedIn }) {
  const socket = useSocket();
  const [newOrders, setNewOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [pickedUpOrders, setPickedUpOrders] = useState([]);

  useEffect(() => {
    console.log('Is socket connected?', socket.connected);

  if (storeId && isStoreLoggedIn) {
    socket.on("new_order", (order) => {
      console.log('NEW ORDER RECEIVED in DND component: ', order);
      setNewOrders((prevOrders) => [...prevOrders, order]);
    });
    socket.on("completed_order", (orderId) => {
      setCompletedOrders((prevOrders) => [...prevOrders, newOrders.find(order => order.id === orderId)]);
      setNewOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
    });
    socket.on("picked_up_order", (orderId) => {
      setPickedUpOrders((prevOrders) => [...prevOrders, completedOrders.find(order => order.id === orderId)]);
      setCompletedOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
    });
    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
    return () => {
      socket.off("new_order");
      socket.off("completed_order");
      socket.off("picked_up_order");
      // if (socket.connected) {
      //   socket.disconnect();
      // }
    };
  }
}, [isStoreLoggedIn]);

  return (
    <div className={styles.orderContainer}>

    <DndProvider backend={HTML5Backend}>
      <div className={styles.newOrders}>
        <h3>New Orders</h3>
        <DroppableOrderContainer orders={newOrders} setOrders={setNewOrders} className={styles.order} />
      </div>

      <div className={styles.completedOrders}>
        <h3>Completed</h3>
        <DroppableOrderContainer orders={completedOrders} setOrders={setCompletedOrders} />
      </div>

      <div className={styles.pickedUpOrders}>
        <h3>Picked Up</h3>
        <DroppableOrderContainer orders={pickedUpOrders} setOrders={setPickedUpOrders} />
      </div>
    </DndProvider>
    </div>
  );
}
