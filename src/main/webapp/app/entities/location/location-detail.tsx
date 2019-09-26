import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './location.reducer';
import { ILocation } from 'app/shared/model/location.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ILocationDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class LocationDetail extends React.Component<ILocationDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { locationEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.location.detail.title">Location</Translate> [<b>{locationEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="address">
                <Translate contentKey="sistemaAmigoApp.location.address">Address</Translate>
              </span>
            </dt>
            <dd>{locationEntity.address}</dd>
            <dt>
              <span id="lat">
                <Translate contentKey="sistemaAmigoApp.location.lat">Lat</Translate>
              </span>
            </dt>
            <dd>{locationEntity.lat}</dd>
            <dt>
              <span id="lng">
                <Translate contentKey="sistemaAmigoApp.location.lng">Lng</Translate>
              </span>
            </dt>
            <dd>{locationEntity.lng}</dd>
            <dt>
              <span id="timestamp">
                <Translate contentKey="sistemaAmigoApp.location.timestamp">Timestamp</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={locationEntity.timestamp} type="date" format={APP_DATE_FORMAT} />
            </dd>
          </dl>
          <Button tag={Link} to="/entity/location" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/location/${locationEntity.id}/edit`} replace color="primary">
            <FontAwesomeIcon icon="pencil-alt" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.edit">Edit</Translate>
            </span>
          </Button>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = ({ location }: IRootState) => ({
  locationEntity: location.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LocationDetail);
