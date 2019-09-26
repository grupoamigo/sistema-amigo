import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { IManouverRequest } from 'app/shared/model/manouver-request.model';
import { getEntities as getManouverRequests } from 'app/entities/manouver-request/manouver-request.reducer';
import { IInspection } from 'app/shared/model/inspection.model';
import { getEntities as getInspections } from 'app/entities/inspection/inspection.reducer';
import { getEntity, updateEntity, createEntity, reset } from './location.reducer';
import { ILocation } from 'app/shared/model/location.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface ILocationUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface ILocationUpdateState {
  isNew: boolean;
  manouverRequestOriginId: string;
  manouverRequestDestinyId: string;
  inspectionId: string;
}

export class LocationUpdate extends React.Component<ILocationUpdateProps, ILocationUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      manouverRequestOriginId: '0',
      manouverRequestDestinyId: '0',
      inspectionId: '0',
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

    this.props.getManouverRequests();
    this.props.getInspections();
  }

  saveEntity = (event, errors, values) => {
    values.timestamp = convertDateTimeToServer(values.timestamp);

    if (errors.length === 0) {
      const { locationEntity } = this.props;
      const entity = {
        ...locationEntity,
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
    this.props.history.push('/entity/location');
  };

  render() {
    const { locationEntity, manouverRequests, inspections, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.location.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.location.home.createOrEditLabel">Create or edit a Location</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : locationEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="location-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="location-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="addressLabel" for="location-address">
                    <Translate contentKey="sistemaAmigoApp.location.address">Address</Translate>
                  </Label>
                  <AvField id="location-address" type="text" name="address" />
                </AvGroup>
                <AvGroup>
                  <Label id="latLabel" for="location-lat">
                    <Translate contentKey="sistemaAmigoApp.location.lat">Lat</Translate>
                  </Label>
                  <AvField id="location-lat" type="text" name="lat" />
                </AvGroup>
                <AvGroup>
                  <Label id="lngLabel" for="location-lng">
                    <Translate contentKey="sistemaAmigoApp.location.lng">Lng</Translate>
                  </Label>
                  <AvField id="location-lng" type="text" name="lng" />
                </AvGroup>
                <AvGroup>
                  <Label id="timestampLabel" for="location-timestamp">
                    <Translate contentKey="sistemaAmigoApp.location.timestamp">Timestamp</Translate>
                  </Label>
                  <AvInput
                    id="location-timestamp"
                    type="datetime-local"
                    className="form-control"
                    name="timestamp"
                    placeholder={'YYYY-MM-DD HH:mm'}
                    value={isNew ? null : convertDateTimeFromServer(this.props.locationEntity.timestamp)}
                  />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/location" replace color="info">
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
  manouverRequests: storeState.manouverRequest.entities,
  inspections: storeState.inspection.entities,
  locationEntity: storeState.location.entity,
  loading: storeState.location.loading,
  updating: storeState.location.updating,
  updateSuccess: storeState.location.updateSuccess
});

const mapDispatchToProps = {
  getManouverRequests,
  getInspections,
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
)(LocationUpdate);
