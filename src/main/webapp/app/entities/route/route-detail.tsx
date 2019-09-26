import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './route.reducer';
import { IRoute } from 'app/shared/model/route.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IRouteDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class RouteDetail extends React.Component<IRouteDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { routeEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.route.detail.title">Route</Translate> [<b>{routeEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="price">
                <Translate contentKey="sistemaAmigoApp.route.price">Price</Translate>
              </span>
            </dt>
            <dd>{routeEntity.price}</dd>
            <dt>
              <span id="name">
                <Translate contentKey="sistemaAmigoApp.route.name">Name</Translate>
              </span>
            </dt>
            <dd>{routeEntity.name}</dd>
            <dt>
              <span id="currency">
                <Translate contentKey="sistemaAmigoApp.route.currency">Currency</Translate>
              </span>
            </dt>
            <dd>{routeEntity.currency}</dd>
          </dl>
          <Button tag={Link} to="/entity/route" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/route/${routeEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ route }: IRootState) => ({
  routeEntity: route.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteDetail);
