import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './seal.reducer';
import { ISeal } from 'app/shared/model/seal.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface ISealDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class SealDetail extends React.Component<ISealDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { sealEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.seal.detail.title">Seal</Translate> [<b>{sealEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="issuer">
                <Translate contentKey="sistemaAmigoApp.seal.issuer">Issuer</Translate>
              </span>
            </dt>
            <dd>{sealEntity.issuer}</dd>
            <dt>
              <span id="uniqueId">
                <Translate contentKey="sistemaAmigoApp.seal.uniqueId">Unique Id</Translate>
              </span>
            </dt>
            <dd>{sealEntity.uniqueId}</dd>
          </dl>
          <Button tag={Link} to="/entity/seal" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/seal/${sealEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ seal }: IRootState) => ({
  sealEntity: seal.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SealDetail);
