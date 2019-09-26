import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './extra-field.reducer';
import { IExtraField } from 'app/shared/model/extra-field.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IExtraFieldDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export class ExtraFieldDetail extends React.Component<IExtraFieldDetailProps> {
  componentDidMount() {
    this.props.getEntity(this.props.match.params.id);
  }

  render() {
    const { extraFieldEntity } = this.props;
    return (
      <Row>
        <Col md="8">
          <h2>
            <Translate contentKey="sistemaAmigoApp.extraField.detail.title">ExtraField</Translate> [<b>{extraFieldEntity.id}</b>]
          </h2>
          <dl className="jh-entity-details">
            <dt>
              <span id="name">
                <Translate contentKey="sistemaAmigoApp.extraField.name">Name</Translate>
              </span>
            </dt>
            <dd>{extraFieldEntity.name}</dd>
            <dt>
              <span id="value">
                <Translate contentKey="sistemaAmigoApp.extraField.value">Value</Translate>
              </span>
            </dt>
            <dd>{extraFieldEntity.value}</dd>
          </dl>
          <Button tag={Link} to="/entity/extra-field" replace color="info">
            <FontAwesomeIcon icon="arrow-left" />{' '}
            <span className="d-none d-md-inline">
              <Translate contentKey="entity.action.back">Back</Translate>
            </span>
          </Button>
          &nbsp;
          <Button tag={Link} to={`/entity/extra-field/${extraFieldEntity.id}/edit`} replace color="primary">
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

const mapStateToProps = ({ extraField }: IRootState) => ({
  extraFieldEntity: extraField.entity
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExtraFieldDetail);
