import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './damage.reducer';
import { IDamage } from 'app/shared/model/damage.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IDamageUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IDamageUpdateState {
  isNew: boolean;
}

export class DamageUpdate extends React.Component<IDamageUpdateProps, IDamageUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }
  }

  saveEntity = (event, errors, values) => {
    values.reportDate = convertDateTimeToServer(values.reportDate);

    if (errors.length === 0) {
      const { damageEntity } = this.props;
      const entity = {
        ...damageEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/damage');
  };

  render() {
    const { damageEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.damage.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.damage.home.createOrEditLabel">Create or edit a Damage</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : damageEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="damage-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="damage-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="reportDateLabel" for="damage-reportDate">
                    <Translate contentKey="sistemaAmigoApp.damage.reportDate">Report Date</Translate>
                  </Label>
                  <AvInput
                    id="damage-reportDate"
                    type="datetime-local"
                    className="form-control"
                    name="reportDate"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? null : convertDateTimeFromServer(this.props.damageEntity.reportDate)}
                  />
                </AvGroup>
                <AvGroup>
                  <Label id="descriptionLabel" for="damage-description">
                    <Translate contentKey="sistemaAmigoApp.damage.description">Description</Translate>
                  </Label>
                  <AvField id="damage-description" type="text" name="description" />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/damage" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  damageEntity: storeState.damage.entity,
  loading: storeState.damage.loading,
  updating: storeState.damage.updating,
  updateSuccess: storeState.damage.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DamageUpdate);
