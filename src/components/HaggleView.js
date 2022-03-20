import React, { useState } from 'react';
import { MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { supabase } from '../supabaseClient';
import { useEffect } from 'react/cjs/react.production.min';
import { Card, Image, Form, Button, Container } from 'react-bootstrap';

const HaggleView = ({id}) => {
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState({});
  const getBarter = async () => {
    try {
      let { data, error } = await supabase
        .from('barters')
        .select()
        .match({ id: 1 });
        if(data) {
          console.log(data);
         
        }
    } catch (error) {
      console.error('try agina', error);
    }
  };
  getBarter();
  console.log('her',user1);

  //   const getItems = async () => {
  //     try {

  //       let { data, error, status } = await supabase.from('items').select();

  //       if (error && status !== 406) {
  //         throw error;
  //       }

  //       if (data) {
  //         console.log(data);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   console.log(getItems())

  // const getSingleItems = async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('items')
  //       .select()
  //       .match({ id: 1 });

  //     if (data) {
  //       console.log(data);
  //     }
  //   } catch (error) {
  //     console.error('try agina', error);
  //   }
  // };

  // const { singleItem } = getSingleItems();

  return (
    <div>
      <Container>
        <Image
          src="https://bcmquwtslvmqbutdhiyo.supabase.in/storage/v1/object/sign/avatars/xsMH4DxwTEdURCh9VqXCHP-1024-80.jpg.webp?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL3hzTUg0RHh3VEVkVVJDaDlWcVhDSFAtMTAyNC04MC5qcGcud2VicCIsImlhdCI6MTY0NzczODM5NiwiZXhwIjoxOTYzMDk4Mzk2fQ.s87b7EnfgVX8LDQdRGEri7GXivhj6FGR3xUyQ0pZRuc"
          alt=""
          roundedCircle={true}
        />
        <Button variant="primary" type="submit">
          Inventory
        </Button>
      </Container>
      <Container></Container>
      <Form>
        <Image
          src="https://bcmquwtslvmqbutdhiyo.supabase.in/storage/v1/object/sign/avatars/external-content.duckduckgo.com.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhdmF0YXJzL2V4dGVybmFsLWNvbnRlbnQuZHVja2R1Y2tnby5jb20uanBnIiwiaWF0IjoxNjQ3NzM4NDgwLCJleHAiOjE5NjMwOTg0ODB9.M3dUjFKXtqWqYRhzn31IPLY7yHkoDlMJUnQHZIeWO7g"
          alt=""
          roundedCircle={true}
        />
        <Button variant="primary" type="submit">
          Inventory
        </Button>
      </Form>
    </div>
  );
};

export default HaggleView;
