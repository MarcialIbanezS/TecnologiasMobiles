<?php

namespace App\FModels;

use Roddy\FirestoreEloquent\Facade\FModel;

class FichaMedica extends FModel
{
    /**
    * Name of your firestore collection
    */
    protected $collection = 'fichamedica';

    /**
    * The primary key of the model/collection
    */
    protected $primaryKey = 'idfichamedica';

    /**
    * The fillable property takes care of defining which fields are
    * to be considered when the user will insert or update data.
    * Fillable property should ba an array. e.g ['id', 'age', 'name']
    */
    protected $fillable = ['idfichamedica','fechaingreso','idpaciente','idoperacion','idcronico','idalergia'];

    /**
    * The required property takes care of defining which fields
    * should be required and cannot be empty when inserting data only.
    * Required property should ba an array. e.g ['id', 'name']
    * Note: idfichamedica removed as it will be auto-generated
    */
    protected $required = ['fechaingreso','idpaciente'];

    /**
    * The default property is use to set a default value for
    * the fields provided in the array if the fields is empty.
    * Default property should ba an array. e.g ['name' => 'Alfred', 'date' => date('Y-m-d)]
    */
    protected $default = [];

    /**
    * The fieldTypes property is use to set a types for
    * the fields provided in the array.
    * Supported types are: integer, string, array and object
    * fieldTypes property should ba an array. e.g ['name' => 'string', 'age' => 'int', 'date' => 'date']
    */
    protected $fieldTypes = [];
}
