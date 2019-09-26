import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './cargo.reducer';
import { ICargo } from 'app/shared/model/cargo.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ICargoDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class CargoDetail extends React.Component<ICargoDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { cargoEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.cargo.detail.title">Cargo</Translate> [<b>{cargoEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="type">
                <Translate contentKey="sistemaAmigoApp.cargo.type">Type</Translate>
              </span>
            </dt>
            <dd>{cargoEntity.type}</dd>
            <dt>
              <span id="uniqueId">
                <Translate contentKey="sistemaAmigoApp.cargo.uniqueId">Unique Id</Translate>
              </span>
            </dt>
            <dd>{cargoEntity.uniqueId}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="sistemaAmigoApp.cargo.description">Description</Translate>
              </span>
            </dt>
            <dd>{cargoEntity.description}</dd>
            <dt>
              <span id="status">
                <Translate contentKey="sistemaAmigoApp.cargo.status">Status</Translate>
              </span>
            </dt>
            <dd>{cargoEntity.status}</dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.cargo.warehouse">Warehouse</Translate>
            </dt>
            <dd>{cargoEntity.warehouse ? cargoEntity.warehouse.name : ''}</dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.cargo.seals">Seals</Translate>
            </dt>
            <dd>{cargoEntity.seals ? cargoEntity.seals.uniqueId : ''}</dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.cargo.client">Client</Translate>
            </dt>
            <dd>{cargoEntity.client ? cargoEntity.client.uniqueId : ''}</dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.cargo.warehouses">Warehouses</Translate>
            </dt>
            <dd>{cargoEntity.warehouses ? cargoEntity.warehouses.name : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/cargo" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/cargo/${cargoEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ cargo }: IRootState) => ({
  cargoEntity: cargo.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CargoDetail);
