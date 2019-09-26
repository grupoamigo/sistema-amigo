import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './damage.reducer';
import { IDamage } from 'app/shared/model/damage.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IDamageDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class DamageDetail extends React.Component<IDamageDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { damageEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.damage.detail.title">Damage</Translate> [<b>{damageEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="reportDate">
                <Translate contentKey="sistemaAmigoApp.damage.reportDate">Report Date</Translate>
              </span>
            </dt>
            <dd>
              <TextFormat value={damageEntity.reportDate} type="date" format={APP_DATE_FORMAT} />
            </dd>
            <dt>
              <span id="description">
                <Translate contentKey="sistemaAmigoApp.damage.description">Description</Translate>
              </span>
            </dt>
            <dd>{damageEntity.description}</dd>
          </dl>
          <Button tag={Link} to="/entity/damage" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/damage/${damageEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ damage }: IRootState) => ({
  damageEntity: damage.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DamageDetail);
