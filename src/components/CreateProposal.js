import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useLocation } from 'react-router-dom';
import { Card, Container, Row, Col, Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router';

import 'bootstrap/dist/css/bootstrap.min.css';


const styles = {
  card: {
    backgroundColor: 'rgba(128, 128, 128, 0.972)',
    //** keep to build out functionality */
    //#rgba(255, 255, 255, 0.972) => white
    borderRadius: 55,
    width: '20.5rem',
    height: '20.5rem',
  },
  cardImage: {
    objectFit: 'cover',
    borderRadius: 55,
    height: '80%',
  },
  containerHolder: {
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.959)',
    // ** keep to build out functionality 
    //'rgba(128, 128, 128, 0.972)', => grey
  },
};

const CreateProposal = ({ state }) => {
  const [loading, setLoading] = useState(true);
  const [swap, setSwap] = useState(null);
  const location = useLocation(null);
  const { item = '' } = location.state || {};
  const user = supabase.auth.user();
  const [userItems, setUserItems] = useState(null);
  const [defaultImage, setDefault] = useState([
    'http://dummyimage.com/140x100/ddd.png/dddddd/000000',
  ]);
  const navigate = useNavigate()

  //this first checks if any swaps are currently made between two users
  useEffect(() => {
    const getAllSwaps = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('swaps')
          .select(
            `
            inbound_id,
            outbound_id,
            id,
            inbound_offer,
            outbound_offer,
            status
            `
          )
          .eq('inbound_id', user.id)
          .eq('outbound_id', item.userId);
        setSwap(data);
      } catch (error) {
        console.error('try again', error);
      }
    };
    getAllSwaps();
  }, [user, item]);

  //...next if there is no swap currently 
  //made between the two this creates it in the database
 
  useEffect(() => {
    const makeSwap = async () => {
      try {
        if (!swap.length) {
          const { data: newSwap } = await supabase.from('swaps').insert([
            {
              inbound_id: user.id,
              status: 'active',
              outbound_id: item.userId,
              inbound_offer: item.id,
            },
          ]);
          setSwap(newSwap);
        }
      } catch (error) {
        console.error(error);
      }
    };
    makeSwap();
  }, [swap]);


//this gets all the users items to render them into the view to pick from
  useEffect(() => {
    const getListings = async () => {
      try {
        setLoading(true);
        let { data, error, status } = await supabase
          .from('items')
          .select('*')
          .eq('userId', user.id);

        if (error && status !== 406) {
          throw error;
        }
        if (data) {
          setUserItems(data);
        }
        console.log(swap.id);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getListings();
  }, [user.id]);


  const handleSubmit = (image, id) => {
    setDefault([image, id]);
  };

  //updates the proposal on click 
  const handleProposal = async (id) => {
  
    if(id) {
    const { data } = await supabase
      .from('swaps')
      .update({
        status: 'pending',
        outbound_offer: id,
      })
      .eq('id', swap[0].id);

     setSwap(data);
     navigate('/haggle')
    }
  };

  return loading ? (
    <div>Loading</div>
  ) : (
    <div>
      <Container style={styles.containerHolder}>
        <Row>
          <Col>
            <Card style={styles.card}>
              <Card.Img
                variant="top"
                src={item.image_url}
                style={styles.cardImage}
              />
            </Card>
          </Col>
          <Col>
           
              <Button onClick={() => handleProposal(defaultImage[1])}>
                Submit Proposal
              </Button>
        
          </Col>
          <Col>
            <Card style={styles.card}>
              <Card.Img
                variant="top"
                src={defaultImage[0]}
                style={styles.cardImage}
              />
            </Card>
          </Col>
        </Row>
      </Container>
      <div className="Haggleitems">
        <Container>
          <Form>
            {userItems.map((item, idx) => {
              return (
                <Card key={item.id} style={{ width: '20.5rem' }}>
                  <Card.Img variant="top" src={item.image_url} />
                  <Button
                    type="button"
                    onClick={() => handleSubmit(item.image_url, item.id)}
                  >
                    Offer
                  </Button>
                </Card>
              );
            })}
          </Form>
        </Container>
      </div>
      <div className="haggleChat">Chat</div>
    </div>
  );
};

export default CreateProposal;
