import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSocket } from '../components/SocketContext';
import styles from '../styles/orderCompletion.module.css'

const ItemType = {
  ORDER: 'ORDER',
};

const DraggableOrder = ({ order, index }) => {
  const [, ref] = useDrag(() => ({
    type: ItemType.ORDER,
    item: { order, index },
  }));

  return (
    <div ref={ref} key={order.id} style={{ border: '1px solid black', margin: '5px', padding: '5px' }}>
      {/* ... Your existing order display logic */}
      {console.log('DRAGGABLE ORDERS: ', order)}
      <p>Customer: {order.user_id} </p>
      <p>Time: {order.created_at} </p>
      <ul>
        {order.items && order.items.map((item, itemIndex) => (
          <li key={itemIndex}>
            Coffee Type: {item.coffee_type} 
            {item.size && <span>, Size: {item.size}</span>}
            {item.price != null && <span>, Price: ${item.price.toFixed(2)}</span>}
            {item.extras && <span>, Extras: {item.extras.join(', ')}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

const DroppableOrderContainer = ({ orders, setOrders, removeOrderFromPreviousList }) => {
  const [{ isOver }, ref] = useDrop({
    accept: ItemType.ORDER,
    drop: (draggedItem) => {
      setOrders((prevOrders) => [...prevOrders, draggedItem.order]);
      removeOrderFromPreviousList(draggedItem.index);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={ref} style={{ backgroundColor: isOver ? 'yellow' : 'transparent', minHeight: '100px' }}>
      {orders.flat().map((order, index) => (
        <DraggableOrder order={order} index={index} key={order.id} /> 
      ))}
    </div>
  );
};

export default function OrderManagement() {
  const socket = useSocket();
  const [newOrders, setNewOrders] = useState([]);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [pickedUpOrders, setPickedUpOrders] = useState([]);

  const removeOrderFromNewOrders = (index) => {
    setNewOrders((prevOrders) => prevOrders.filter((_, idx) => idx !== index));
  };
  
  const removeOrderFromCompletedOrders = (index) => {
    setCompletedOrders((prevOrders) => prevOrders.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    // console.log('Is socket connected?', socket.connected);
    

      socket.on("new_order", (order) => {
        setNewOrders((prevOrders) => [...prevOrders, order]);
      });
      socket.on("completed_order", (orderId) => {
        setCompletedOrders((prevOrders) => [
          ...prevOrders,
          newOrders.find((order) => order.id === orderId),
        ]);
        setNewOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
        );
      });
      socket.on("picked_up_order", (orderId) => {
        setPickedUpOrders((prevOrders) => [
          ...prevOrders,
          completedOrders.find((order) => order.id === orderId),
        ]);
        setCompletedOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== orderId)
        );
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
  }, []);

  
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: 'flex', gap: '20px' }} className={styles.orderContainer}>
      <div className={styles.newOrders}>
          <h3>New Orders</h3>
          <DroppableOrderContainer
            orders={newOrders}
            setOrders={setNewOrders}
            removeOrderFromPreviousList={removeOrderFromNewOrders}
          />
        </div>
        <div className={styles.completedOrders}>
          <h3>Completed Orders</h3>
          <DroppableOrderContainer
            orders={completedOrders}
            setOrders={setCompletedOrders}
            removeOrderFromPreviousList={removeOrderFromNewOrders}
          />
        </div>
        <div className={styles.pickedUpOrders}>
          <h3>Picked Up Orders</h3>
          <DroppableOrderContainer
            orders={pickedUpOrders}
            setOrders={setPickedUpOrders}
            removeOrderFromPreviousList={removeOrderFromCompletedOrders}
          />
        </div>
      </div>
    </DndProvider>
  );
}