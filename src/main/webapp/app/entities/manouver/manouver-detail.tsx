import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './manouver.reducer';
import { IManouver } from 'app/shared/model/manouver.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IManouverDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class ManouverDetail extends React.Component<IManouverDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { manouverEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.manouver.detail.title">Manouver</Translate> [<b>{manouverEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="title">
                <Translate contentKey="sistemaAmigoApp.manouver.title">Title</Translate>
              </span>
            </dt>
            <dd>{manouverEntity.title}</dd>
            <dt>
              <span id="description">
                <Translate contentKey="sistemaAmigoApp.manouver.description">Description</Translate>
              </span>
            </dt>
            <dd>{manouverEntity.description}</dd>
            <dt>
              <span id="unit">
                <Translate contentKey="sistemaAmigoApp.manouver.unit">Unit</Translate>
              </span>
            </dt>
            <dd>{manouverEntity.unit}</dd>
            <dt>
              <span id="division">
                <Translate contentKey="sistemaAmigoApp.manouver.division">Division</Translate>
              </span>
            </dt>
            <dd>{manouverEntity.division}</dd>
            <dt>
              <span id="price">
                <Translate contentKey="sistemaAmigoApp.manouver.price">Price</Translate>
              </span>
            </dt>
            <dd>{manouverEntity.price}</dd>
            <dt>
              <span id="currency">
                <Translate contentKey="sistemaAmigoApp.manouver.currency">Currency</Translate>
              </span>
            </dt>
            <dd>{manouverEntity.currency}</dd>
            <dt>
              <Translate contentKey="sistemaAmigoApp.manouver.provider">Provider</Translate>
            </dt>
            <dd>{manouverEntity.provider ? manouverEntity.provider.legalName : ''}</dd>
          </dl>
          <Button tag={Link} to="/entity/manouver" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/manouver/${manouverEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ manouver }: IRootState) => ({
  manouverEntity: manouver.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManouverDetail);
