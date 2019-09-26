import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './service.reducer';
import { IService } from 'app/shared/model/service.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IServiceDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class ServiceDetail extends React.Component<IServiceDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { serviceEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.service.detail.title">Service</Translate> [<b>{serviceEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">
                <Translate contentKey="sistemaAmigoApp.service.title">Title</Translate>
              </span>
            </dt>
            <dd>{serviceEntity.title}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="sistemaAmigoApp.service.description">Description</Translate>
              </span>
            </dt>
            <dd>{serviceEntity.description}</dd>
            <dt>
              <span id="type">
                <Translate contentKey="sistemaAmigoApp.service.type">Type</Translate>
              </span>
            </dt>
            <dd>{serviceEntity.type}</dd>
            <dt>
              <span id="unit">
                <Translate contentKey="sistemaAmigoApp.service.unit">Unit</Translate>
              </span>
            </dt>
            <dd>{serviceEntity.unit}</dd>
            <dt>
              <span id="status">
                <Translate contentKey="sistemaAmigoApp.service.status">Status</Translate>
              </span>
            </dt>
            <dd>{serviceEntity.status}</dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.service.company">Company</Translate>
            </dt>
            <dd>{serviceEntity.company ? serviceEntity.company.legalName : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/service" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/service/${serviceEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ service }: IRootState) => ({
  serviceEntity: service.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ServiceDetail);
